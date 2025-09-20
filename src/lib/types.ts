export type OrderStatus = 'New' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  orderTime: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface SalesData {
  date: string;
  sales: number;
}
