import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (isAvailable: boolean) => void;
}

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint="food item"
        />
        <div className="absolute top-2 right-2">
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-card/70 hover:bg-card">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the menu item "{item.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <Badge className="absolute top-2 left-2" variant={item.isAvailable ? "default" : "secondary"}>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1">{item.name}</CardTitle>
        <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
        <CardDescription className="mt-2 text-sm h-10 overflow-hidden text-ellipsis">
            {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 mt-auto">
        <div className="flex items-center space-x-2">
            <Switch
                id={`available-${item.id}`}
                checked={item.isAvailable}
                onCheckedChange={onToggleAvailability}
                aria-label='Toggle availability'
            />
            <Label htmlFor={`available-${item.id}`}>Availability</Label>
        </div>
      </CardFooter>
    </Card>
  );
}
