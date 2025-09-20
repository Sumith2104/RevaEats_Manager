"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dailySales, weeklySales } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export function SalesChart() {
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
