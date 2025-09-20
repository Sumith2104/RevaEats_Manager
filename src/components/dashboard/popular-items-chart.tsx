"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { popularItemsData } from '@/lib/data';

export function PopularItemsChart() {
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
