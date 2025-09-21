import { Database } from './supabase/database.types';

export type OrderStatus = Database['public']['Enums']['order_status'];

export interface Order {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  orderTime: Date;
  order_otp: string;
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export interface SalesData {
  date: string;
  sales: number;
}
