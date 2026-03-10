export type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  is_available: boolean;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  note: string;
};

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered';

export type OrderWithItems = {
  id: number;
  table_id: number;
  status: OrderStatus;
  created_at: string;
  payment_method?: 'cash' | 'card' | null;
  items: {
    id: number;
    menu_item_id: number;
    quantity: number;
    note: string | null;
    menu_item: MenuItem;
  }[];
};

