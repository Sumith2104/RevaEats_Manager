'use server';

/**
 * @fileOverview A flow for recommending menu items to feature based on sales analytics.
 *
 * - recommendMenuItems - A function that returns menu item recommendations.
 * - RecommendMenuItemsInput - The input type for the recommendMenuItems function (currently empty).
 * - RecommendMenuItemsOutput - The return type for the recommendMenuItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMenuItemsInputSchema = z.object({});
export type RecommendMenuItemsInput = z.infer<typeof RecommendMenuItemsInputSchema>;

const RecommendMenuItemsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      item: z.string().describe('The name of the menu item.'),
      reason: z.string().describe('The reason for recommending this item.'),
    })
  ).describe('A list of recommended menu items with reasons.')
});
export type RecommendMenuItemsOutput = z.infer<typeof RecommendMenuItemsOutputSchema>;

export async function recommendMenuItems(input: RecommendMenuItemsInput): Promise<RecommendMenuItemsOutput> {
  return recommendMenuItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMenuItemsPrompt',
  input: {schema: RecommendMenuItemsInputSchema},
  output: {schema: RecommendMenuItemsOutputSchema},
  prompt: `Based on sales analytics, recommend menu items to feature. Consider popularity, profit margin, and current inventory.

  {% Don't mention popularity if you don't have it as a field. %}
  {% Don't mention profit margin if you don't have it as a field. %}
  {% Don't mention current inventory if you don't have it as a field. %}

  Return a list of recommendations with reasons why each item should be featured.`,
});

const recommendMenuItemsFlow = ai.defineFlow(
  {
    name: 'recommendMenuItemsFlow',
    inputSchema: RecommendMenuItemsInputSchema,
    outputSchema: RecommendMenuItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
