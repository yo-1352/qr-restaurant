-- Supabase schema for QR Restaurant demo
-- Run this in the Supabase SQL editor.

create table if not exists public.tables (
  id bigint generated always as identity primary key,
  name text not null,
  qr_code_url text
);

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text,
  is_available boolean not null default true
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  table_id bigint not null references public.tables (id) on delete restrict,
  payment_method text check (payment_method in ('cash', 'card')) default 'cash',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  menu_item_id bigint not null references public.menu_items (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  note text
);

-- Sample data for a quick demo

insert into public.tables (name)
values ('Table 1'), ('Table 2'), ('Table 3')
on conflict do nothing;

insert into public.menu_items (name, description, price, category, is_available)
values
  ('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil.', 9.90, 'Pizza', true),
  ('Pepperoni Pizza', 'Tomato, mozzarella, and pepperoni.', 11.50, 'Pizza', true),
  ('Caesar Salad', 'Romaine, parmesan, croutons, Caesar dressing.', 7.50, 'Salads', true),
  ('Spaghetti Bolognese', 'Pasta with slow-cooked beef ragù.', 12.00, 'Pasta', true),
  ('Tiramisu', 'Coffee-flavored Italian dessert.', 5.50, 'Desserts', true)
on conflict do nothing;

