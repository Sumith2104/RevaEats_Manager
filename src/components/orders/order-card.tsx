'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order } from '@/lib/types';
import { Clock } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const statusColors: { [key in Order['status']]: string } = {
  'New': 'bg-chart-3',
  'Preparing': 'bg-chart-4',
  'Ready for Pickup': 'bg-chart-2',
  'Completed': 'bg-muted-foreground',
  'Cancelled': 'bg-destructive',
};


export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [timeAgo, setTimeAgo] = useState(0);

  useState(() => {
    setTimeAgo(Math.round((new Date().getTime() - new Date(order.orderTime).getTime()) / (1000 * 60)));
  })

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-lg">Order #{order.id.split('-')[1]}</CardTitle>
              <CardDescription>{order.name}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5 pl-2">
              <span className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}></span>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm">
            {order.items.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{timeAgo} minutes ago</span>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <Select
              value={order.status}
              onValueChange={(value: Order['status']) => onStatusChange(order.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Preparing">Preparing</SelectItem>
                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
