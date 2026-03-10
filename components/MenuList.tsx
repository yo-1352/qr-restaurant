'use client';

import { useMemo, useState } from 'react';
import type { MenuItem, CartItem } from '../types';

type Props = {
  menuItems: MenuItem[];
  onAddToCart: (item: CartItem) => void;
};

export default function MenuList({ menuItems, onAddToCart }: Props) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('Όλα');

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleNoteChange = (id: number, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = (item: MenuItem) => {
    const quantity = quantities[item.id] ?? 1;
    if (quantity <= 0) return;
    onAddToCart({
      menuItem: item,
      quantity,
      note: notes[item.id] ?? '',
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setNotes((prev) => ({ ...prev, [item.id]: '' }));
  };

  const itemsByCategory = useMemo(
    () =>
      menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
        const category = item.category || 'Άλλα';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {}),
    [menuItems]
  );

  const categories = useMemo(
    () => ['Όλα', ...Object.keys(itemsByCategory)],
    [itemsByCategory]
  );

  const visibleItems: MenuItem[] = useMemo(() => {
    if (activeCategory === 'Όλα') {
      return menuItems;
    }
    return itemsByCategory[activeCategory] ?? [];
  }, [activeCategory, itemsByCategory, menuItems]);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
              activeCategory === cat
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compact list of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <div className="text-sm font-semibold leading-tight">
                  {item.name}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="text-sm font-semibold text-green-700 shrink-0">
                €{item.price.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs flex items-center">
                Qty:
                <input
                  type="number"
                  min={1}
                  value={quantities[item.id] ?? 1}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="ml-2 w-14 rounded border border-gray-300 px-1 py-1 text-xs"
                />
              </label>
              <button
                onClick={() => handleAdd(item)}
                className="inline-flex justify-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
              >
                Add
              </button>
            </div>

            <textarea
              placeholder="Note (optional)"
              value={notes[item.id] ?? ''}
              onChange={(e) => handleNoteChange(item.id, e.target.value)}
              className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

