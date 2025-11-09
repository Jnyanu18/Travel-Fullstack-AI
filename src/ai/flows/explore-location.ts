// src/ai/flows/explore-location.ts
'use server';
/**
 * @fileOverview A flow to explore a location and view its popular attractions, points of interest, restaurants, and hotels.
 *
 * - exploreLocation - A function that handles the location exploration process.
 * - ExploreLocationInput - The input type for the exploreLocation function.
 * - ExploreLocationOutput - The return type for the exploreLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExploreLocationInputSchema = z.object({
  location: z.string().describe('The location to explore.'),
});
export type ExploreLocationInput = z.infer<typeof ExploreLocationInputSchema>;

const ExploreLocationOutputSchema = z.object({
  popularAttractions: z.string().describe('A list of popular attractions in the location.'),
  pointsOfInterest: z.string().describe('A list of points of interest in the location.'),
  restaurants: z.string().describe('A list of restaurants in the location.'),
  hotels: z.string().describe('A list of hotels in the location.'),
});
export type ExploreLocationOutput = z.infer<typeof ExploreLocationOutputSchema>;

export async function exploreLocation(input: ExploreLocationInput): Promise<ExploreLocationOutput> {
  return exploreLocationFlow(input);
}

const exploreLocationPrompt = ai.definePrompt({
  name: 'exploreLocationPrompt',
  input: {schema: ExploreLocationInputSchema},
  output: {schema: ExploreLocationOutputSchema},
  prompt: `You are a travel expert. A user wants to explore the following location: {{{location}}}. Provide the following information about the location:

*   popular attractions
*   points of interest
*   restaurants
*   hotels

Format your response as a JSON object.`,
});

const exploreLocationFlow = ai.defineFlow(
  {
    name: 'exploreLocationFlow',
    inputSchema: ExploreLocationInputSchema,
    outputSchema: ExploreLocationOutputSchema,
  },
  async input => {
    const {output} = await exploreLocationPrompt(input);
    return output!;
  }
);
