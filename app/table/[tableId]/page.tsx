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
        <h1 className="text-2xl font-semibold">Μη έγκυρο τραπέζι</h1>
        <p className="text-gray-600">
          Ο αριθμός τραπεζιού στο URL δεν είναι έγκυρος.
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
        <h1 className="text-2xl font-semibold">Το μενού δεν είναι διαθέσιμο</h1>
        <p className="text-gray-600">
          Δεν ήταν δυνατή η φόρτωση του μενού αυτή τη στιγμή. Παρακαλούμε καλέστε έναν σερβιτόρο.
        </p>
      </div>
    );
  }

  return (
    <ClientCartWrapper
      tableId={tableId}
      menuItems={menuItems as MenuItem[]}
    />
  );
}

