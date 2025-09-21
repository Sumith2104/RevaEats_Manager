'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import type { MenuItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be positive')
  ),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Must be a valid URL').optional(),
  is_available: z.boolean(),
  image_file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MenuItemFormProps {
  item: MenuItem | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(item?.image_url || null);

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item ? { ...item, image_file: undefined } : {
      name: '',
      description: '',
      price: 0.00,
      category: '',
      image_url: 'https://picsum.photos/seed/newitem/600/400',
      is_available: true,
      image_file: undefined,
    },
  });

  const imageFile = watch('image_file');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(item?.image_url || null);
    }
  }, [imageFile, item]);


  useEffect(() => {
    if (item) {
      reset({...item, image_file: undefined});
      setPreviewImage(item.image_url);
    } else {
      reset({
        name: '',
        description: '',
        price: 0.00,
        category: '',
        image_url: 'https://picsum.photos/seed/newitem/600/400',
        is_available: true,
        image_file: undefined,
      });
      setPreviewImage('https://picsum.photos/seed/newitem/600/400');
    }
  }, [item, reset]);


  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    let imageUrl = item?.image_url || data.image_url;

    const file = data.image_file?.[0];

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('menu-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setIsUploading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase
        .storage
        .from('menu-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const finalItem = {
      ...(item || {}),
      ...data,
      image_url: imageUrl,
    };
    
    delete finalItem.image_file;

    onSave(finalItem);
    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="image_file">Menu Image</Label>
            {previewImage && (
                <div className="mt-2">
                    <Image src={previewImage} alt="Image preview" width={200} height={150} className="rounded-md object-cover"/>
                </div>
            )}
            <Input id="image_file" type="file" accept="image/*" {...register('image_file')} />
            {errors.image_file && <p className="text-sm text-destructive">{errors.image_file.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="is_available"
            control={control}
            render={({ field }) => (
                <Switch
                    id="is_available"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
          />
          <Label htmlFor="is_available">Available</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel} disabled={isUploading}>Cancel</Button>
        <Button type="submit" disabled={isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
}
