'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import KitchenOrderCard from '../../components/KitchenOrderCard';
import type { OrderWithItems, OrderStatus } from '../../types';

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

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
    return <div>Checking access…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kitchen dashboard</h1>
          <p className="text-gray-600 text-sm">
            New orders appear here in real time.
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/kitchen/login';
          }}
          className="text-xs text-gray-600 underline"
        >
          Log out
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-gray-500 text-sm">No active orders right now.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onChangeStatus={(status) => handleChangeStatus(order.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

