import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';
import { getClientIp, isRateLimited } from '../../../../../lib/security';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const rateKey = `kitchen-status:${ip}`;
  if (isRateLimited(rateKey, { windowMs: 5_000, max: 50 })) {
    return NextResponse.json(
      { error: 'Too many status updates. Please slow down.' },
      { status: 429 }
    );
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const status = body.status as
    | 'new'
    | 'preparing'
    | 'ready'
    | 'delivered'
    | 'waiting_for_pay'
    | 'paid'
    | undefined;

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  const { error } = await supabase.from('orders').update({ status }).eq('id', id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

