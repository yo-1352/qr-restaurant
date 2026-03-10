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
};

export default function KitchenOrderCard({ order, onChangeStatus }: Props) {
  const created = new Date(order.created_at);
  const time = created.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Order #{order.id}</div>
          <div className="text-lg font-semibold">
            Table {order.table_id}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
          >
            {order.status.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">{time}</span>
          {order.payment_method && (
            <span className="mt-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              Pay: {order.payment_method.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 space-y-1 text-sm">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-2">
            <div>
              <div className="font-medium">
                {item.quantity} × {item.menu_item.name}
              </div>
              {item.note && (
                <div className="text-xs text-gray-500">
                  Note: {item.note}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400">
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
          New
        </button>
        <button
          onClick={() => onChangeStatus('preparing')}
          className="px-2 py-1 rounded bg-yellow-100 text-xs font-medium hover:bg-yellow-200"
        >
          Preparing
        </button>
        <button
          onClick={() => onChangeStatus('ready')}
          className="px-2 py-1 rounded bg-blue-100 text-xs font-medium hover:bg-blue-200"
        >
          Ready
        </button>
        <button
          onClick={() => onChangeStatus('delivered')}
          className="px-2 py-1 rounded bg-green-100 text-xs font-medium hover:bg-green-200"
        >
          Delivered
        </button>
      </div>
    </div>
  );
}

