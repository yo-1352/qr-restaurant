'use client';

import type { OrderWithItems, OrderStatus } from '../types';

type Props = {
  order: OrderWithItems;
  onChangeStatus: (status: OrderStatus) => void;
};

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-red-100 text-red-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  waiting_for_pay: 'bg-amber-100 text-amber-800',
  paid: 'bg-gray-100 text-gray-700',
};

export default function KitchenOrderCard({ order, onChangeStatus }: Props) {
  const created = new Date(order.created_at);
  const time = created.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusLabel: Record<OrderStatus, string> = {
    new: 'ΝΕΑ',
    preparing: 'ΕΤΟΙΜΑΖΕΤΑΙ',
    ready: 'ΕΤΟΙΜΟ',
    delivered: 'ΠΑΡΑΔΟΘΗΚΕ',
    waiting_for_pay: 'ΑΝΑΜΟΝΗ ΠΛΗΡΩΜΗΣ',
    paid: 'ΟΛΟΚΛΗΡΩΘΗΚΕ',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500">Παραγγελία #{order.id}</div>
          <div className="text-base font-semibold">
            Τραπέζι {order.table_id}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
          >
            {statusLabel[order.status]}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
          {order.payment_method && (
            <span className="mt-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              Πληρωμή: {order.payment_method.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 space-y-1 text-[13px]">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-2">
            <div>
              <div className="font-medium">
                {item.quantity} × {item.menu_item.name}
              </div>
              {item.note && (
                <div className="text-[11px] text-gray-500">
                  Σημείωση: {item.note}
                </div>
              )}
            </div>
            <div className="text-[11px] text-gray-400">
              {item.menu_item.category}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
        <button
          onClick={() => onChangeStatus('new')}
          className="px-2 py-1 rounded bg-red-100 text-xs font-medium hover:bg-red-200"
        >
          Νέα
        </button>
        <button
          onClick={() => onChangeStatus('preparing')}
          className="px-2 py-1 rounded bg-yellow-100 text-xs font-medium hover:bg-yellow-200"
        >
          Ετοιμάζεται
        </button>
        <button
          onClick={() => onChangeStatus('ready')}
          className="px-2 py-1 rounded bg-blue-100 text-xs font-medium hover:bg-blue-200"
        >
          Έτοιμο
        </button>
        <button
          onClick={() => onChangeStatus('delivered')}
          className="px-2 py-1 rounded bg-green-100 text-xs font-medium hover:bg-green-200"
        >
          Παραδόθηκε
        </button>
        <button
          onClick={() => onChangeStatus('waiting_for_pay')}
          className="px-2 py-1 rounded bg-amber-100 text-xs font-medium hover:bg-amber-200"
        >
          Αναμονή πληρωμής
        </button>
        {order.status === 'waiting_for_pay' && (
          <button
            onClick={() => onChangeStatus('paid')}
            className="px-2 py-1 rounded bg-gray-100 text-xs font-medium hover:bg-gray-200"
          >
            Ολοκληρώθηκε (πληρωμή)
          </button>
        )}
      </div>
    </div>
  );
}

