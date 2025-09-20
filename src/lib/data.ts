import type { Order, MenuItem, SalesData } from './types';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Campus Burger',
    description: 'A classic beef burger with all the fixings.',
    price: 8.99,
    category: 'Burgers',
    imageUrl: 'https://picsum.photos/seed/burger/600/400',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Cheesy Pizza',
    description: '12-inch pizza with mozzarella and tomato sauce.',
    price: 12.50,
    category: 'Pizza',
    imageUrl: 'https://picsum.photos/seed/pizza/600/400',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Garden Salad',
    description: 'Fresh greens, tomatoes, cucumbers, and a light vinaigrette.',
    price: 6.75,
    category: 'Salads',
    imageUrl: 'https://picsum.photos/seed/salad/600/400',
    isAvailable: false,
  },
  {
    id: '4',
    name: 'Chicken Tenders',
    description: 'Crispy chicken tenders with your choice of sauce.',
    price: 7.99,
    category: 'Sides',
    imageUrl: 'https://picsum.photos/seed/tenders/600/400',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Fountain Drink',
    description: 'Refreshing soda from our fountain.',
    price: 1.99,
    category: 'Drinks',
    imageUrl: 'https://picsum.photos/seed/drink/600/400',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Spicy Chicken Sandwich',
    description: 'A fiery chicken sandwich for the brave.',
    price: 9.50,
    category: 'Burgers',
    imageUrl: 'https://picsum.photos/seed/spicy_chicken/600/400',
    isAvailable: true,
  }
];

export const orders: Order[] = [
  {
    id: 'CKC-1001',
    customerName: 'Alex Johnson',
    items: [
      { id: '1', name: 'Campus Burger', quantity: 1, price: 8.99 },
      { id: '5', name: 'Fountain Drink', quantity: 1, price: 1.99 },
    ],
    total: 10.98,
    status: 'New',
    orderTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: 'CKC-1002',
    customerName: 'Maria Garcia',
    items: [
      { id: '2', name: 'Cheesy Pizza', quantity: 2, price: 12.50 },
    ],
    total: 25.00,
    status: 'Preparing',
    orderTime: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'CKC-1003',
    customerName: 'Sam Lee',
    items: [
      { id: '6', name: 'Spicy Chicken Sandwich', quantity: 1, price: 9.50 },
    ],
    total: 9.50,
    status: 'Ready for Pickup',
    orderTime: new Date(Date.now() - 25 * 60 * 1000),
  },
];

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
