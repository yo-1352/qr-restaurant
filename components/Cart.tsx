'use client';

import type { CartItem } from '../types';

type Props = {
  cart: CartItem[];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onRemoveItem: (index: number) => void;
};

export default function Cart({
  cart,
  onSubmit,
  isSubmitting,
  onRemoveItem,
}: Props) {
  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-sm text-gray-500">
        Your order is empty. Add some items from the menu.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <h2 className="text-lg font-semibold">Your order</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {cart.map((item, index) => (
          <div
            key={`${item.menuItem.id}-${index}`}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <div>
              <div className="font-medium">
                {item.menuItem.name} × {item.quantity}
              </div>
              {item.note && (
                <div className="text-xs text-gray-500">
                  Note: {item.note}
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="mt-1 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="font-semibold">
              €{(item.menuItem.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="font-semibold">Total</span>
        <span className="font-semibold text-green-700">
          €{total.toFixed(2)}
        </span>
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Sending order...' : 'Submit order'}
      </button>
      <p className="text-xs text-gray-500">
        Please review your order before submitting. You can tell your waiter if
        you need to change it.
      </p>
    </div>
  );
}

