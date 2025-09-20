'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { generateOrderStatusMessage } from '@/ai/flows/order-status-notifications';
import { Loader2, Copy, Check } from 'lucide-react';

interface OrderNotificationDialogProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  order: Order;
}

export function OrderNotificationDialog({ isOpen, setOpen, order }: OrderNotificationDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setMessage('');
      const fetchMessage = async () => {
        try {
          const result = await generateOrderStatusMessage({
            orderId: order.id,
            customerName: order.customerName,
            currentStatus: order.status,
            menuItems: order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
            estimatedTime: '10-15 minutes', // Example time
          });
          setMessage(result.message);
        } catch (error) {
          console.error('Failed to generate message:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not generate notification message.',
          });
          setMessage('Failed to generate message. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessage();
    }
  }, [isOpen, order, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
        title: "Copied!",
        description: "Notification message copied to clipboard.",
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI-Generated Notification</DialogTitle>
          <DialogDescription>
            A suggested message for order #{order.id.split('-')[1]} with status "{order.status}".
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="pr-12"
            />
          )}
          {!isLoading && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleCopy}
              aria-label="Copy message"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={() => {
              toast({ title: "Notification Sent!", description: "Customer has been notified."});
              setOpen(false);
          }}>Send Notification</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
