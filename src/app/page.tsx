'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { OrderCard } from '@/components/orders/order-card';
import { supabase } from '@/lib/supabase/client';
import type { Order } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          order_time,
          order_otp,
          users ( name ),
          order_items (
            quantity,
            menu_items (
              id,
              name,
              price
            )
          )
        `)
        .not('status', 'eq', 'Completed')
        .order('order_time', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', JSON.stringify(error, null, 2));
      } else if (data) {
        const fetchedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          name: order.users.name,
          total: order.total,
          status: order.status,
          orderTime: new Date(order.order_time),
          order_otp: order.order_otp,
          items: order.order_items.map((item: any) => ({
            id: item.menu_items.id,
            name: item.menu_items.name,
            price: item.menu_items.price,
            quantity: item.quantity,
          })),
        }));
        setOrders(fetchedOrders);
      }
      setLoading(false);
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
        if (newStatus === 'Completed') {
            toast({
              title: "Order Completed!",
              description: `Order #${orders.find(o => o.id === orderId)?.order_otp} has been marked as completed.`,
            });
            // Remove the order from the local state
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } else {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        }
    }
  };
  
  const orderStatuses: Order['status'][] = ['New', 'Preparing', 'Ready for Pickup', 'Cancelled'];

  const renderOrderGrid = (orderList: Order[]) => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      );
    }
    if (orderList.length === 0) {
      return <div className="text-center text-muted-foreground col-span-full">No orders in this category.</div>
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orderList.map(order => (
          <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
        ))}
      </div>
    );
  }

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
              {renderOrderGrid(orders)}
            </TabsContent>
            {orderStatuses.map(status => (
                <TabsContent key={status} value={status}>
                  {renderOrderGrid(orders.filter(o => o.status === status))}
                </TabsContent>
            ))}
        </div>
      </Tabs>
    </AppLayout>
  );
}
