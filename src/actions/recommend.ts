
'use server';

import { recommendRestaurantsByCuisine } from '@/ai/flows/recommend-restaurants-by-cuisine';
import { restaurants } from '@/lib/data';

export async function getRecommendedRestaurants(cuisinePreference: string): Promise<string[]> {
  if (!cuisinePreference) {
    return [];
  }

  try {
    const restaurantDataForAI = restaurants.map(({ name, description }) => ({ name, description }));

    const recommendedNames = await recommendRestaurantsByCuisine({
      cuisinePreference,
      restaurants: restaurantDataForAI,
    });

    return recommendedNames || [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Re-throw error so the UI can handle it
    throw new Error('Failed to get AI recommendations. Please try again.');
  }
}
