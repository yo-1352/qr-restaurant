import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(_req: NextRequest) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        id,
        table_id,
        status,
        payment_method,
        created_at,
        order_items (
          id,
          menu_item_id,
          quantity,
          note,
          menu_items (
            id,
            name,
            description,
            price,
            category,
            is_available
          )
        )
      `
    )
    .neq('status', 'delivered')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  const orders = (data || []).map((order: any) => ({
    id: order.id,
    table_id: order.table_id,
    status: order.status,
    created_at: order.created_at,
    payment_method: order.payment_method,
    items: order.order_items.map((oi: any) => ({
      id: oi.id,
      menu_item_id: oi.menu_item_id,
      quantity: oi.quantity,
      note: oi.note,
      menu_item: oi.menu_items,
    })),
  }));

  return NextResponse.json({ orders });
}

