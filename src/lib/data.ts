import type { Order, MenuItem, SalesData } from './types';

export const menuItems: MenuItem[] = [];

export const orders: Order[] = [];

export const dailySales: SalesData[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
    sales: Math.floor(Math.random() * (500 - 200 + 1) + 200),
  };
});

export const weeklySales: SalesData[] = Array.from({ length: 4 }, (_, i) => {
    return {
      date: `Week ${i + 1}`,
      sales: Math.floor(Math.random() * (3500 - 1500 + 1) + 1500),
    };
});
  
export const popularItemsData = [
    { name: 'Campus Burger', sales: 120, fill: 'hsl(var(--chart-1))' },
    { name: 'Cheesy Pizza', sales: 98, fill: 'hsl(var(--chart-2))' },
    { name: 'Spicy Chicken Sandwich', sales: 86, fill: 'hsl(var(--chart-3))' },
    { name: 'Chicken Tenders', sales: 75, fill: 'hsl(var(--chart-4))' },
    { name: 'Fountain Drink', sales: 150, fill: 'hsl(var(--chart-5))' },
];
