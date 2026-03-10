import { StoryPointScale } from '../types/index';

/**
 * Converts hours to the nearest valid story point value from the scale.
 *
 * This function finds the story point value whose hour equivalent is closest
 * to the provided hours value. It supports custom story point scales.
 *
 * Validates: Requirements 3.1, 3.3, 3.4, 3.5
 *
 * @param hours - The number of hours to convert
 * @param scale - The story point scale mapping (e.g., { '1': 1, '3': 4, '5': 8, ... })
 * @returns The nearest story point value from the scale
 *
 * @example
 * const scale = { '1': 1, '3': 4, '5': 8, '8': 12, '10': 16 };
 * convertHoursToStoryPoints(5, scale); // Returns 5 (5 hours ≈ 5 points)
 * convertHoursToStoryPoints(6, scale); // Returns 5 (6 hours is closer to 8 than 4)
 * convertHoursToStoryPoints(10, scale); // Returns 8 (10 hours is closer to 12 than 8)
 */
export function convertHoursToStoryPoints(
  hours: number,
  scale: StoryPointScale
): number {
  // Get all valid story point values sorted numerically
  const points = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);

  if (points.length === 0) {
    return 0;
  }

  // Find the story point value whose hour equivalent is closest to the input hours
  let closest = points[0];
  let minDifference = Math.abs(scale[closest as unknown as keyof StoryPointScale] - hours);

  for (const point of points) {
    const difference = Math.abs(scale[point as unknown as keyof StoryPointScale] - hours);
    if (difference < minDifference) {
      minDifference = difference;
      closest = point;
    }
  }

  return closest;
}

/**
 * Converts story points to hours using the provided scale.
 *
 * This function performs a direct lookup in the story point scale to get
 * the equivalent hours. If the story point value is not in the scale,
 * it returns 0.
 *
 * Validates: Requirements 3.4, 3.5
 *
 * @param points - The story point value to convert
 * @param scale - The story point scale mapping (e.g., { '1': 1, '3': 4, '5': 8, ... })
 * @returns The equivalent hours for the given story points, or 0 if not found
 *
 * @example
 * const scale = { '1': 1, '3': 4, '5': 8, '8': 12, '10': 16 };
 * convertStoryPointsToHours(5, scale); // Returns 8
 * convertStoryPointsToHours(8, scale); // Returns 12
 * convertStoryPointsToHours(13, scale); // Returns 0 (not in scale)
 */
export function convertStoryPointsToHours(
  points: number,
  scale: StoryPointScale
): number {
  return scale[points as unknown as keyof StoryPointScale] ?? 0;
}
