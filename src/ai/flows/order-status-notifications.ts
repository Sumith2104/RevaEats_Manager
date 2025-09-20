'use server';

/**
 * @fileOverview Generates suggested order status update messages using AI.
 *
 * - generateOrderStatusMessage - A function that generates an order status message.
 * - OrderStatusInput - The input type for the generateOrderStatusMessage function.
 * - OrderStatusOutput - The return type for the generateOrderStatusMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrderStatusInputSchema = z.object({
  orderId: z.string().describe('The ID of the order.'),
  currentStatus: z.string().describe('The current status of the order (e.g., received, preparing, out for delivery, delivered).'),
  estimatedTime: z.string().optional().describe('The estimated delivery or pickup time.'),
  customerName: z.string().describe('The name of the customer.'),
  menuItems: z.string().describe('The items that the customer ordered'),
});
export type OrderStatusInput = z.infer<typeof OrderStatusInputSchema>;

const OrderStatusOutputSchema = z.object({
  message: z.string().describe('The suggested order status update message.'),
});
export type OrderStatusOutput = z.infer<typeof OrderStatusOutputSchema>;

export async function generateOrderStatusMessage(input: OrderStatusInput): Promise<OrderStatusOutput> {
  return orderStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'orderStatusPrompt',
  input: {schema: OrderStatusInputSchema},
  output: {schema: OrderStatusOutputSchema},
  prompt: `You are a helpful assistant for a kitchen staff member.

  Based on the current order status, generate a message to inform the customer about their order's progress.
  Keep the message concise and friendly.

  Order ID: {{{orderId}}}
  Customer Name: {{{customerName}}}
  Current Status: {{{currentStatus}}}
  Estimated Time: {{{estimatedTime}}}
  Menu Items: {{{menuItems}}}

  Suggested Message:`,
});

const orderStatusFlow = ai.defineFlow(
  {
    name: 'orderStatusFlow',
    inputSchema: OrderStatusInputSchema,
    outputSchema: OrderStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
