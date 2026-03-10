import { supabase } from '../../../lib/supabaseClient';
import ClientCartWrapper from './ClientCartWrapper';
import type { MenuItem } from '../../../types';

type PageProps = {
  params: Promise<{ tableId: string }>;
};

export default async function TablePage({ params }: PageProps) {
  const { tableId: tableIdParam } = await params;
  const tableId = Number(tableIdParam);

  if (Number.isNaN(tableId)) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Invalid table</h1>
        <p className="text-gray-600">
          The table number in the URL is not valid.
        </p>
      </div>
    );
  }

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error || !menuItems) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Menu unavailable</h1>
        <p className="text-gray-600">
          Sorry, we could not load the menu right now. Please call a waiter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Table {tableId}</h1>
        <p className="text-gray-600 text-sm">
          Welcome! Browse the menu and place your order.
        </p>
      </div>
      <ClientCartWrapper
        tableId={tableId}
        menuItems={menuItems as MenuItem[]}
      />
    </div>
  );
}

