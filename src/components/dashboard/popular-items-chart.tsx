"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';

interface PopularItem {
  name: string;
  sales: number;
}

export function PopularItemsChart() {
  const [popularItemsData, setPopularItemsData] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('order_items')
        .select('quantity, menu_items ( name )')
        .limit(500); // Fetch a larger number of records to aggregate

      if (error) {
        console.error('Error fetching popular items:', JSON.stringify(error, null, 2));
        setLoading(false);
        return;
      }

      if (data) {
        const itemCounts = data.reduce((acc, item) => {
          const itemName = item.menu_items?.name;
          if (itemName) {
            acc[itemName] = (acc[itemName] || 0) + item.quantity;
          }
          return acc;
        }, {} as Record<string, number>);

        const sortedItems = Object.entries(itemCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, sales]) => ({ name, sales }));
        
        setPopularItemsData(sortedItems);
      }
      setLoading(false);
    };

    fetchPopularItems();
  }, []);

  if (loading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={popularItemsData} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }} />
          <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
