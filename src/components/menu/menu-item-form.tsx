'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { MenuItem } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be positive')
  ),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  isAvailable: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;


interface MenuItemFormProps {
  item: MenuItem | null;
  onSave: (data: MenuItem) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item || {
      name: '',
      description: '',
      price: 0.00,
      category: '',
      imageUrl: 'https://picsum.photos/seed/newitem/600/400',
      isAvailable: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    onSave({ ...item, ...data, id: item?.id || String(Date.now()) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <DialogDescription>
          Fill in the details below. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register('category')} />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" {...register('imageUrl')} />
          {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="isAvailable"
            control={control}
            render={({ field }) => (
                <Switch
                    id="isAvailable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
