import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Utensils, CheckCircle } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { PopularItemsChart } from '@/components/dashboard/popular-items-chart';
import { AiRecommendations } from '@/components/dashboard/ai-recommendations';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { subDays, startOfDay, endOfDay, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

async function getDashboardStats() {
    const supabase = createSupabaseServerClient();
    const today = new Date();
    const lastMonth = subDays(today, 30);
    const yesterday = subDays(today, 1);

    const { data: totalRevenueData, error: totalRevenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'Completed');

    if (totalRevenueError) console.error('Error fetching total revenue:', JSON.stringify(totalRevenueError, null, 2));

    const { data: lastMonthRevenueData, error: lastMonthRevenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'Completed')
        .gte('order_time', lastMonth.toISOString());

    if (lastMonthRevenueError) console.error('Error fetching last month revenue:', JSON.stringify(lastMonthRevenueError, null, 2));

    const totalRevenue = totalRevenueData?.reduce((acc, order) => acc + order.total, 0) ?? 0;
    const lastMonthRevenue = lastMonthRevenueData?.reduce((acc, order) => acc + order.total, 0) ?? 0;

    const revenueChange = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const { data: todaysOrdersData, error: todaysOrdersError } = await supabase
        .from('orders')
        .select('id')
        .gte('order_time', startOfDay(today).toISOString())
        .lte('order_time', endOfDay(today).toISOString());

    if (todaysOrdersError) console.error('Error fetching today\'s orders:', JSON.stringify(todaysOrdersError, null, 2));

    const { data: yesterdaysOrdersData, error: yesterdaysOrdersError } = await supabase
        .from('orders')
        .select('id')
        .gte('order_time', startOfDay(yesterday).toISOString())
        .lte('order_time', endOfDay(yesterday).toISOString());
    
    if (yesterdaysOrdersError) console.error('Error fetching yesterday\'s orders:', JSON.stringify(yesterdaysOrdersError, null, 2));

    const todaysOrdersCount = todaysOrdersData?.length ?? 0;
    const yesterdaysOrdersCount = yesterdaysOrdersData?.length ?? 0;

    const orderChange = todaysOrdersCount - yesterdaysOrdersCount;

    const { data: popularItemData, error: popularItemError } = await supabase
        .from('order_items')
        .select('menu_items ( name ), quantity')
        .limit(100);

    if (popularItemError) console.error('Error fetching popular item data:', JSON.stringify(popularItemError, null, 2));

    const itemCounts = popularItemData?.reduce((acc, item) => {
        const itemName = item.menu_items?.name;
        if (itemName) {
            acc[itemName] = (acc[itemName] || 0) + item.quantity;
        }
        return acc;
    }, {} as Record<string, number>) ?? {};

    const popularItemName = Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b, 'N/A');
    
    const { data: recentCompletedOrders, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, name, total, order_time')
        .eq('status', 'Completed')
        .order('order_time', { ascending: false })
        .limit(5);

    if (recentOrdersError) console.error('Error fetching recent orders:', JSON.stringify(recentOrdersError, null, 2));


    return {
        totalRevenue,
        revenueChange,
        todaysOrdersCount,
        orderChange,
        popularItemName,
        recentCompletedOrders: recentCompletedOrders ?? []
    };
}


export default async function DashboardPage() {
  const { totalRevenue, revenueChange, todaysOrdersCount, orderChange, popularItemName, recentCompletedOrders } = await getDashboardStats();
  
  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{revenueChange.toFixed(1)}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{todaysOrdersCount}</div>
            <p className="text-xs text-muted-foreground">{orderChange >= 0 ? '+' : ''}{orderChange} since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Item</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularItemName}</div>
            <p className="text-xs text-muted-foreground">Most sold item this week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily and weekly sales performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <div className="space-y-4 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Popular Items</CardTitle>
                    <CardDescription>Top-selling items this month.</CardDescription>
                </CardHeader>
                <CardContent className='pt-2'>
                    <PopularItemsChart />
                </CardContent>
            </Card>
        </div>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recently completed orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentCompletedOrders.length > 0 ? (
                    <ul className="space-y-4">
                        {recentCompletedOrders.map((order, index) => (
                            <li key={order.id}>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium">{order.name}'s order completed</p>
                                        <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(order.order_time), { addSuffix: true })}</p>
                                    </div>
                                    <Badge variant="secondary">₹{order.total.toFixed(2)}</Badge>
                                </div>
                                {index < recentCompletedOrders.length - 1 && <Separator className="my-4" />}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        No completed orders yet.
                    </div>
                )}
            </CardContent>
        </Card>
        <div className="space-y-4 lg:col-span-1">
            <AiRecommendations />
        </div>
      </div>
    </AppLayout>
  );
}
