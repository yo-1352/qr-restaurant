'use client';

import { useState } from 'react';
import MenuList from '../../../components/MenuList';
import Cart from '../../../components/Cart';
import type { MenuItem, CartItem, Language } from '../../../types';

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
  const [hasOrdered, setHasOrdered] = useState(false);
  const [language, setLanguage] = useState<Language>('el');

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
      setHasOrdered(true);
      setSuccessMessage('Thank you! Your order has been sent to the kitchen.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGreek = language === 'el';

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {isGreek ? 'Τραπέζι' : 'Table'} {tableId}
          </h1>
          <p className="text-gray-600 text-sm">
            {isGreek
              ? 'Καλώς ήρθατε! Περιηγηθείτε στο μενού και κάντε την παραγγελία σας.'
              : 'Welcome! Browse the menu and place your order.'}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setLanguage('el')}
            className={`px-2 py-1 rounded-full border ${
              isGreek
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            ΕΛ
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-full border ${
              !isGreek
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {hasOrdered ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
          <div className="success-checkmark mb-1 flex items-center justify-center rounded-full bg-green-100 w-16 h-16 border-4 border-green-500">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-green-600"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">
            {isGreek
              ? 'Σας ευχαριστούμε για την παραγγελία!'
              : 'Thank you for your order!'}
          </h2>
          <p className="text-gray-600 text-sm max-w-sm">
            {isGreek
              ? 'Η παραγγελία σας στάλθηκε στην κουζίνα. Ο σερβιτόρος θα σας εξυπηρετήσει σύντομα.'
              : 'Your order has been sent to the kitchen. A waiter will bring your food shortly.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setHasOrdered(false);
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className="mt-2 px-3 py-1 rounded border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-50"
          >
            {isGreek ? 'Νέα παραγγελία' : 'Order again'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 space-y-4">
            <MenuList
              menuItems={menuItems}
              onAddToCart={handleAddToCart}
              language={language}
            />
          </div>
          <div className="md:w-80 space-y-3" id="cart-section">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              <h2 className="text-lg font-semibold">
                {isGreek ? 'Τρόπος πληρωμής' : 'Payment method'}
              </h2>
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
                  {isGreek ? 'Μετρητά' : 'Cash'}
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
                  {isGreek ? 'Κάρτα' : 'Card'}
                </button>
              </div>
            </div>
            <Cart
              cart={cart}
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
              onRemoveItem={handleRemoveFromCart}
              language={language}
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
      )}
      {!hasOrdered && (
        <button
          type="button"
          className={`fixed left-0 right-0 bottom-0 z-30 md:hidden px-3 pb-3 transition-opacity ${
            cart.length === 0 ? 'opacity-80' : 'opacity-100'
          }`}
          onClick={() => {
            if (cart.length === 0) return;
            const el = document.getElementById('cart-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold shadow-[0_-2px_12px_rgba(0,0,0,0.35)] ${
              cart.length === 0
                ? 'bg-gray-300 text-gray-600'
                : 'bg-green-600 text-white'
            }`}
          >
            <span className="flex items-center gap-2 text-xs">
              <span className="inline-flex h-6 min-w-[1.6rem] items-center justify-center rounded-full bg-white/20 px-2 text-xs font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              {isGreek ? 'είδη' : 'items'}
            </span>
            <span className="text-sm">
              {isGreek ? 'Καλάθι' : 'Cart'}
            </span>
            <span className="text-sm">
              €
              {cart
                .reduce(
                  (sum, item) => sum + item.menuItem.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

