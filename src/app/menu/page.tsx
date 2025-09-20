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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleSaveItem = async (item: MenuItem) => {
    const { id, name, description, price, category, image_url, is_available } = item;
    const itemData = { name, description, price, category, image_url, is_available };

    if (editingItem) {
      // Update
      const { error } = await supabase.from('menu_items').update(itemData).eq('id', id);
      if (error) console.error("Error updating item:", JSON.stringify(error, null, 2));
    } else {
      // Create
      const { error } = await supabase.from('menu_items').insert(itemData);
      if (error) console.error("Error creating item:", JSON.stringify(error, null, 2));
    }

    setEditingItem(null);
    setFormOpen(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
    if (error) console.error("Error deleting item:", JSON.stringify(error, null, 2));
  };

  const handleToggleAvailability = async (itemId: string, isAvailable: boolean) => {
    const { error } = await supabase.from('menu_items').update({ is_available: isAvailable }).eq('id', itemId);
    if (error) console.error("Error toggling availability:", JSON.stringify(error, null, 2));
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
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
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
              onCancel={() => setFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDeleteItem(item.id)}
              onToggleAvailability={(isAvailable) => handleToggleAvailability(item.id, isAvailable)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
