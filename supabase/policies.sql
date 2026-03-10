-- Row Level Security (RLS) policies for QR Restaurant demo
-- Run this AFTER running schema.sql.

-- Enable RLS on core tables
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- MENU ITEMS
-- Allow anyone (anon or authenticated) to read the menu
create policy "Public read menu_items"
on public.menu_items
for select
to public
using (true);

-- ORDERS
-- Allow anonymous customers to create orders
create policy "Anon insert orders"
on public.orders
for insert
to anon
with check (true);

-- Allow authenticated kitchen users to see all orders
create policy "Kitchen read orders"
on public.orders
for select
to authenticated
using (true);

-- Allow authenticated kitchen users to update order status
create policy "Kitchen update orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

-- ORDER ITEMS
-- Allow anonymous customers to insert order_items for their new orders
create policy "Anon insert order_items"
on public.order_items
for insert
to anon
with check (true);

-- Allow authenticated kitchen users to read all order_items
create policy "Kitchen read order_items"
on public.order_items
for select
to authenticated
using (true);

