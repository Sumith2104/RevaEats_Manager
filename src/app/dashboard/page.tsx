import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Utensils } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { PopularItemsChart } from '@/components/dashboard/popular-items-chart';
import { AiRecommendations } from '@/components/dashboard/ai-recommendations';

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+125</div>
            <p className="text-xs text-muted-foreground">+10 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Item</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Campus Burger</div>
            <p className="text-xs text-muted-foreground">Most sold item this week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily and weekly sales performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Popular Items</CardTitle>
                    <CardDescription>Top-selling items this month.</CardDescription>
                </CardHeader>
                <CardContent className='pt-2'>
                    <PopularItemsChart />
                </CardContent>
            </Card>
            <AiRecommendations />
        </div>
      </div>
    </AppLayout>
  );
}
