'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItemForm } from '@/components/menu/menu-item-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { menuItems as mockMenuItems } from '@/lib/data';
import type { MenuItem } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
    } else {
      setMenuItems(prev => [...prev, { ...item, id: String(Date.now()) }]);
    }
    setEditingItem(null);
    setFormOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleToggleAvailability = (itemId: string, isAvailable: boolean) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, isAvailable } : i));
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
            <MenuItemForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={() => setFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
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
    </AppLayout>
  );
}
