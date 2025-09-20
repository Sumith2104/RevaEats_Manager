'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { OrderCard } from '@/components/orders/order-card';
import { orders as mockOrders } from '@/lib/data';
import type { Order } from '@/lib/types';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  
  const orderStatuses: Order['status'][] = ['New', 'Preparing', 'Ready for Pickup', 'Completed'];

  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Incoming Orders</h1>
      </div>
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {orderStatuses.map(status => (
                <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-1 mt-4">
            <TabsContent value="all">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
                    ))}
                </div>
            </TabsContent>
            {orderStatuses.map(status => (
                <TabsContent key={status} value={status}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {orders.filter(o => o.status === status).map(order => (
                            <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
                        ))}
                    </div>
                </TabsContent>
            ))}
        </div>
      </Tabs>
    </AppLayout>
  );
}
