'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import KitchenOrderCard from '../../components/KitchenOrderCard';
import type { OrderWithItems, OrderStatus } from '../../types';

const WORKFLOW_STATUSES: OrderStatus[] = ['new', 'preparing', 'ready', 'delivered'];

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const ordersBySection = useMemo(() => {
    const workflow = { new: [] as OrderWithItems[], preparing: [] as OrderWithItems[], ready: [] as OrderWithItems[], delivered: [] as OrderWithItems[] };
    const waitingForPay: OrderWithItems[] = [];
    for (const order of orders) {
      if (order.status === 'waiting_for_pay') {
        waitingForPay.push(order);
      } else if (WORKFLOW_STATUSES.includes(order.status)) {
        workflow[order.status].push(order);
      }
    }
    // Sort each section by created_at descending (newest first)
    const sortByNewest = (a: OrderWithItems, b: OrderWithItems) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    workflow.new.sort(sortByNewest);
    workflow.preparing.sort(sortByNewest);
    workflow.ready.sort(sortByNewest);
    workflow.delivered.sort(sortByNewest);
    waitingForPay.sort(sortByNewest);
    return { workflow, waitingForPay };
  }, [orders]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/kitchen/login');
        return;
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isCheckingAuth) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/kitchen/orders');
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || 'Failed to fetch orders');
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      }
    };
    fetchOrders();
  }, [isCheckingAuth]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          (async () => {
            try {
              const res = await fetch('/api/kitchen/orders');
              if (!res.ok) return;
              const data = await res.json();
              setOrders(data.orders || []);
            } catch {
            }
          })();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isCheckingAuth]);

  const handleChangeStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/kitchen/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to update status');
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  if (isCheckingAuth) {
    return <div>Γίνεται έλεγχος πρόσβασης…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Πίνακας κουζίνας</h1>
          <p className="text-gray-600 text-sm">
            Οι νέες παραγγελίες εμφανίζονται εδώ σε πραγματικό χρόνο. Οι παραδομένες παραμένουν μέχρι την πληρωμή.
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/kitchen/login';
          }}
          className="text-xs text-gray-600 underline"
        >
          Αποσύνδεση
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main workflow: New → Preparing → Ready → Delivered */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STATUSES.map((status) => (
              <section
                key={status}
                className="flex flex-col rounded-lg border border-gray-200 bg-gray-50/50 min-h-[200px]"
              >
                <h2 className="px-3 py-2 font-semibold text-sm uppercase tracking-wide text-gray-600 border-b border-gray-200 bg-white/80 rounded-t-lg">
                  {status === 'new' && 'Νέα'}
                  {status === 'preparing' && 'Ετοιμάζεται'}
                  {status === 'ready' && 'Έτοιμο'}
                  {status === 'delivered' && 'Παραδόθηκε'}
                  <span className="ml-1.5 text-gray-400 font-normal">
                    ({ordersBySection.workflow[status].length})
                  </span>
                </h2>
                <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[70vh]">
                  {ordersBySection.workflow[status].length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">Καμία παραγγελία</p>
                  ) : (
                    ordersBySection.workflow[status].map((order) => (
                      <KitchenOrderCard
                        key={order.id}
                        order={order}
                        onChangeStatus={(s) => handleChangeStatus(order.id, s)}
                      />
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Side: Waiting for pay */}
        <section className="lg:w-80 flex-shrink-0 flex flex-col rounded-lg border border-amber-200 bg-amber-50/50 min-h-[200px]">
          <h2 className="px-3 py-2 font-semibold text-sm uppercase tracking-wide text-amber-800 border-b border-amber-200 bg-amber-100/80 rounded-t-lg">
            Σε αναμονή πληρωμής
            <span className="ml-1.5 text-amber-600 font-normal">
              ({ordersBySection.waitingForPay.length})
            </span>
          </h2>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[70vh]">
            {ordersBySection.waitingForPay.length === 0 ? (
              <p className="text-xs text-amber-700/70 py-4 text-center">Καμία</p>
            ) : (
              ordersBySection.waitingForPay.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onChangeStatus={(s) => handleChangeStatus(order.id, s)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

