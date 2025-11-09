'use server';
/**
 * @fileOverview An AI agent that provides personalized recommendations for activities, restaurants, and accommodations.
 *
 * - getPersonalizedRecommendations - A function that returns personalized recommendations based on user preferences and real-time data.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  preferences: z
    .string()
    .describe('The user preferences for activities, restaurants, and accommodations.'),
  location: z.string().describe('The location for which recommendations are requested.'),
  realTimeData: z
    .string()
    .optional()
    .describe('Optional real-time data such as current weather or traffic conditions.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  activities: z.array(z.string()).describe('Recommended activities.'),
  restaurants: z.array(z.string()).describe('Recommended restaurants.'),
  accommodations: z.array(z.string()).describe('Recommended accommodations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return getPersonalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a travel expert providing personalized recommendations based on user preferences and real-time data for the location.

  Location: {{{location}}}
  Preferences: {{{preferences}}}
  Real-time Data: {{{realTimeData}}}

  Provide recommendations for activities, restaurants, and accommodations tailored to the user's preferences, location, and any provided real-time data.
  The activities, restaurants, and accommodations should be an array of strings.
  Activities:
  Restaurants:
  Accommodations:`,
});

const getPersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
