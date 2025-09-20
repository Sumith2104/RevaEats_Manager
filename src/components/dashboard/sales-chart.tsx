"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { startOfWeek, startOfDay, subDays, format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

interface SalesData {
  date: string;
  sales: number;
}

export function SalesChart() {
  const [dailySales, setDailySales] = useState<SalesData[]>([]);
  const [weeklySales, setWeeklySales] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const today = new Date();
      
      // Daily Sales (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i)).reverse();
      const dailyPromises = last7Days.map(day => 
        supabase
          .from('orders')
          .select('total')
          .eq('status', 'Completed')
          .gte('order_time', startOfDay(day).toISOString())
          .lte('order_time', endOfDay(day).toISOString())
      );
      
      const dailyResults = await Promise.all(dailyPromises);
      const processedDailySales = dailyResults.map((result, i) => {
        const total = result.data?.reduce((sum, order) => sum + order.total, 0) ?? 0;
        return {
          date: format(last7Days[i], 'eee'),
          sales: total
        };
      });
      setDailySales(processedDailySales);

      // Weekly Sales (last 4 weeks)
      const last4Weeks = Array.from({ length: 4 }, (_, i) => startOfWeek(subDays(today, i * 7)));
      const weeklyPromises = last4Weeks.map(weekStart => {
        const weekEnd = endOfDay(addDays(weekStart, 6));
        return supabase
          .from('orders')
          .select('total')
          .eq('status', 'Completed')
          .gte('order_time', weekStart.toISOString())
          .lte('order_time', weekEnd.toISOString());
      });

      const weeklyResults = await Promise.all(weeklyPromises);
      const processedWeeklySales = weeklyResults.map((result, i) => {
        const total = result.data?.reduce((sum, order) => sum + order.total, 0) ?? 0;
        return {
          date: `Week ${weeklyResults.length - i}`,
          sales: total
        };
      }).reverse();
      setWeeklySales(processedWeeklySales);

      setLoading(false);
    };
    
    // Helper functions to be used inside the effect
    const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };


    fetchSalesData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        <CardContent className="p-0 pt-4">
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </CardContent>
      </TabsContent>
      <TabsContent value="weekly">
        <CardContent className="p-0 pt-4">
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </CardContent>
      </TabsContent>
    </Tabs>
  );
}
