'use server';
/**
 * @fileOverview An AI agent for recommending restaurants based on cuisine preferences.
 *
 * - recommendRestaurantsByCuisine - A function that recommends restaurants based on cuisine preferences.
 * - RecommendRestaurantsByCuisineInput - The input type for the recommendRestaurantsByCuisine function.
 * - RecommendRestaurantsByCuisineOutput - The return type for the recommendRestaurantsByCuisine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRestaurantsByCuisineInputSchema = z.object({
  cuisinePreference: z
    .string()
    .describe('The cuisine preference entered by the user in the search bar.'),
  restaurants: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe('An array of restaurants with their names and descriptions.'),
});
export type RecommendRestaurantsByCuisineInput = z.infer<typeof RecommendRestaurantsByCuisineInputSchema>;

const RecommendRestaurantsByCuisineOutputSchema = z.array(z.string()).describe('An array of restaurant names that match the cuisine preference.');
export type RecommendRestaurantsByCuisineOutput = z.infer<typeof RecommendRestaurantsByCuisineOutputSchema>;

export async function recommendRestaurantsByCuisine(input: RecommendRestaurantsByCuisineInput): Promise<RecommendRestaurantsByCuisineOutput> {
  return recommendRestaurantsByCuisineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRestaurantsByCuisinePrompt',
  input: {schema: RecommendRestaurantsByCuisineInputSchema},
  output: {schema: RecommendRestaurantsByCuisineOutputSchema},
  prompt: `Given the following cuisine preference: {{{cuisinePreference}}}, and a list of restaurants with their names and descriptions, recommend restaurants that match the cuisine preference.

Restaurants:
{{#each restaurants}}
- Name: {{this.name}}, Description: {{this.description}}
{{/each}}

Only return an array of restaurant names that match the cuisine preference. Do not include any other text.`,
});

const recommendRestaurantsByCuisineFlow = ai.defineFlow(
  {
    name: 'recommendRestaurantsByCuisineFlow',
    inputSchema: RecommendRestaurantsByCuisineInputSchema,
    outputSchema: RecommendRestaurantsByCuisineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
