import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { getClientIp, isRateLimited, sanitizeNote } from '../../../lib/security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateKey = `orders:${ip}`;
    if (isRateLimited(rateKey, { windowMs: 60_000, max: 20 })) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const tableIdRaw = (body as any).tableId;
    const paymentMethodRaw = (body as any).paymentMethod;
    const itemsRaw = (body as any).items;

    const tableId = Number(tableIdRaw);
    const paymentMethod =
      paymentMethodRaw === 'card' ? 'card' : ('cash' as 'cash' | 'card');

    if (!Number.isInteger(tableId) || tableId <= 0) {
      return NextResponse.json({ error: 'Invalid table id' }, { status: 400 });
    }

    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    const items = itemsRaw.map((item: any) => {
      const menuItemId = Number(item?.menuItemId);
      const quantity = Number(item?.quantity);
      const note = sanitizeNote(item?.note);
      if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
        throw new Error('Invalid menu item');
      }
      if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 100) {
        throw new Error('Invalid quantity');
      }
      return { menuItemId, quantity, note };
    });

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        table_id: tableId,
        status: 'new',
        payment_method: paymentMethod ?? 'cash',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error(orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    const orderItemsPayload = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      note: item.note,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error(itemsError);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}

