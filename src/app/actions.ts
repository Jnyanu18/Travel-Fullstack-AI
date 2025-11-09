'use server';

import {
  generatePersonalizedItinerary,
  type GeneratePersonalizedItineraryInput,
} from '@/ai/flows/generate-personalized-itinerary';
import {
  exploreLocation,
  type ExploreLocationInput,
} from '@/ai/flows/explore-location';
import {
  getPersonalizedRecommendations,
  type PersonalizedRecommendationsInput,
} from '@/ai/flows/get-personalized-recommendations';

export async function generateItineraryAction(
  input: GeneratePersonalizedItineraryInput
) {
  try {
    const result = await generatePersonalizedItinerary(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return { success: false, error: 'Failed to generate itinerary. Please try again.' };
  }
}

export async function exploreLocationAction(input: ExploreLocationInput) {
  try {
    const result = await exploreLocation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error exploring location:', error);
    return { success: false, error: 'Failed to explore location. Please try again.' };
  }
}

export async function getRecommendationsAction(
  input: PersonalizedRecommendationsInput
) {
  try {
    const result = await getPersonalizedRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { success: false, error: 'Failed to get recommendations. Please try again.' };
  }
}
