## QR Restaurant Ordering – Demo Setup

This repo is a minimal QR-based restaurant ordering system:

- Customers scan a QR code and land on `/table/[tableId]`
- They browse the menu, add items to a cart, and submit an order
- The kitchen sees incoming orders in real time on `/kitchen`

Everything is built with **Next.js (App Router) + Tailwind CSS + Supabase**.

---

### 1. Requirements

- Node.js 18+ (LTS)
- A free Supabase project

---

### 2. Supabase setup

1. Create a new project in Supabase.
2. In the Supabase dashboard, go to **SQL Editor**.
3. Copy the contents of:

   - `supabase/schema.sql`
   - `supabase/policies.sql`

   and run them (you can paste them into two separate SQL tabs or one after another).

4. Enable **Realtime** for the `public.orders` table:

   - Go to **Database → Replication → Realtime**
   - Enable the `public` schema, then enable `orders`

5. Enable **email/password auth**:

   - Go to **Authentication → Providers**
   - Turn on **Email**
   - Go to **Authentication → Users → Add user**
   - Create a user (for example):  
     - Email: `kitchen@example.com`  
     - Password: `password123`

---

### 3. Environment variables

1. In this project folder, copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. In Supabase, go to **Settings → API** and copy:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Paste those values into `.env.local`.

> If `NEXT_PUBLIC_SUPABASE_URL` is missing, the app will show `Error: supabaseUrl is required.` – make sure `.env.local` is correctly filled and restart `npm run dev`.

---

### 4. Install dependencies and run locally

From the project root:

```bash
npm install
npm run dev
```

Then open:

- Customer (table 1): `http://localhost:3000/table/1`
- Kitchen login: `http://localhost:3000/kitchen/login`
- Kitchen dashboard: `http://localhost:3000/kitchen`

Log into the kitchen with the email/password you created in Supabase.

---

### 5. Demo flows

**Customer flow**

1. Open `http://localhost:3000/table/1` on your phone or browser.
2. Add some menu items with quantities and optional notes.
3. Submit the order.

**Kitchen flow**

1. On another device (or tab), open `http://localhost:3000/kitchen/login`.
2. Log in as your kitchen/admin user.
3. Go to `http://localhost:3000/kitchen`.
4. New orders should appear in real time:
   - See table number, items, notes, time, and status.
   - Use the buttons to change status: **new → preparing → ready → delivered**.

---

### 6. QR code URLs

Each table has a dynamic URL:

- Table 1 → `/table/1`
- Table 2 → `/table/2`
- Table 3 → `/table/3`

If your deployed domain is, for example:

- `https://qr-restaurant.vercel.app`

then your QR codes should point to:

- `https://qr-restaurant.vercel.app/table/1`
- `https://qr-restaurant.vercel.app/table/2`
- `https://qr-restaurant.vercel.app/table/3`

You can generate QR codes using any online QR generator:

1. Paste the URL for a specific table.
2. Download the QR image.
3. Print and place it on the table.

Scanning a QR code for table `N` will always open `/table/N` – there is **one single app**, not separate sites.

---

### 7. Files overview

- `app/table/[tableId]/page.tsx` – customer table page (menu + cart wrapper)
- `app/table/[tableId]/ClientCartWrapper.tsx` – client-side cart + order submit
- `app/api/orders/route.ts` – API route to create `orders` + `order_items`
- `components/MenuList.tsx` – menu UI with quantity + note per item
- `components/Cart.tsx` – cart UI, total, submit button
- `app/kitchen/login/page.tsx` – kitchen admin login page
- `app/kitchen/page.tsx` – kitchen dashboard with realtime updates
- `app/api/kitchen/orders/route.ts` – fetch orders with items for dashboard
- `app/api/kitchen/orders/[id]/route.ts` – update order status
- `lib/supabaseClient.ts` – shared Supabase client
- `supabase/schema.sql` – database tables + sample data
- `supabase/policies.sql` – RLS policies for simple but safe demo

This is enough to run a complete end-to-end demo locally or on a deployment (e.g. Vercel).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
