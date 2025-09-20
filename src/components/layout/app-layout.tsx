'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  LineChart,
  ShoppingCart,
  Utensils,
  Menu as MenuIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AppLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { href: "/", icon: ShoppingCart, label: "Orders" },
    { href: "/menu", icon: Utensils, label: "Menu" },
    { href: "/dashboard", icon: LineChart, label: "Dashboard" },
];

export function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();
    const [orderCount, setOrderCount] = useState(3);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);


    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-card md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Utensils className="h-6 w-6 text-primary" />
                            <span className="font-headline">Campus Kitchen</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navItems.map(({ href, icon: Icon, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === href ? 'bg-muted text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                    {label === "Orders" && mounted && (
                                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                            {orderCount}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <MenuIcon className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                                >
                                    <Utensils className="h-6 w-6 text-primary" />
                                    <span>Campus Kitchen</span>
                                </Link>
                                {navItems.map(({ href, icon: Icon, label }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === href ? 'bg-muted text-foreground' : 'text-muted-foreground'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Image
                                    src="https://picsum.photos/seed/avatar/40/40"
                                    width={40}
                                    height={40}
                                    alt="User avatar"
                                    className="rounded-full"
                                    data-ai-hint="person face"
                                />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/login">Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
