'use client';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItemForm } from '@/components/menu/menu-item-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';
import type { MenuItem } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('menu_items').select('*').order('name');
    if (error) {
      console.error('Error fetching menu items:', JSON.stringify(error, null, 2));
    } else if (data) {
      setMenuItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenuItems();

    const channel = supabase
      .channel('realtime menu')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        (payload) => {
          fetchMenuItems();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveItem = async (item: Omit<MenuItem, 'id'> & { id?: string }) => {
    const { id, ...itemData } = item;

    if (id) {
      // Update
      const { error } = await supabase.from('menu_items').update(itemData).eq('id', id);
      if (error) {
        console.error("Error updating item:", JSON.stringify(error, null, 2));
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update item.' });
      } else {
        toast({ title: 'Success', description: 'Menu item updated.' });
      }
    } else {
      // Create
      const { error } = await supabase.from('menu_items').insert(itemData);
      if (error) {
        console.error("Error creating item:", JSON.stringify(error, null, 2));
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create item.' });
      } else {
        toast({ title: 'Success', description: 'New menu item added.' });
      }
    }

    setEditingItem(null);
    setFormOpen(false);
  };

  const handleToggleAvailability = async (itemId: string, isAvailable: boolean) => {
    const { error } = await supabase.from('menu_items').update({ is_available: isAvailable }).eq('id', itemId);
    if (error) {
        console.error("Error toggling availability:", JSON.stringify(error, null, 2));
    } else {
        setMenuItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, is_available: isAvailable } : item
            )
        );
    }
  };
  
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormOpen(true);
  }

  const handleAddNew = () => {
    setEditingItem(null);
    setFormOpen(true);
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Menu Management</h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) {
            setEditingItem(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              <DialogDescription>
                Fill in the details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <MenuItemForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setFormOpen(false);
                setEditingItem(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {menuItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onToggleAvailability={(isAvailable) => handleToggleAvailability(item.id, isAvailable)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
