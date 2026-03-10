'use client';

import { useState } from 'react';
import MenuList from '../../../components/MenuList';
import Cart from '../../../components/Cart';
import type { MenuItem, CartItem } from '../../../types';

type Props = {
  tableId: number;
  menuItems: MenuItem[];
};

export default function ClientCartWrapper({ tableId, menuItems }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          paymentMethod,
          items: cart.map((c) => ({
            menuItemId: c.menuItem.id,
            quantity: c.quantity,
            note: c.note,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to send order');
      }

      setCart([]);
      setSuccessMessage('Thank you! Your order has been sent to the kitchen.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex-1 space-y-4">
        <MenuList menuItems={menuItems} onAddToCart={handleAddToCart} />
      </div>
      <div className="md:w-80 space-y-3">
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <h2 className="text-lg font-semibold">Payment method</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                paymentMethod === 'cash'
                  ? 'border-green-600 bg-green-50 text-green-800'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              Cash
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              Card
            </button>
          </div>
        </div>
        <Cart
          cart={cart}
          onSubmit={handleSubmitOrder}
          isSubmitting={isSubmitting}
          onRemoveItem={handleRemoveFromCart}
        />
        {successMessage && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

