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

/**
 * Converts total hours to total story points based on the highest story point value.
 * Uses the largest story point value as the base unit for calculation.
 *
 * @param hours - The number of hours to convert
 * @param scale - The story point scale mapping
 * @returns The total story points available
 *
 * @example
 * const scale = { '1': 1, '3': 4, '5': 8, '8': 12, '10': 16 };
 * convertHoursToTotalStoryPoints(41.41, scale); // Returns ~25.88 (41.41 / 16 * 10)
 */
export function convertHoursToTotalStoryPoints(
  hours: number,
  scale: StoryPointScale
): number {
  // Get the highest story point value and its hour equivalent
  const points = Object.keys(scale)
    .map(Number)
    .sort((a, b) => b - a);

  if (points.length === 0) {
    return 0;
  }

  const highestPoint = points[0];
  const hoursPerHighestPoint = scale[highestPoint as unknown as keyof StoryPointScale];

  if (hoursPerHighestPoint === 0) {
    return 0;
  }

  // Calculate total story points: (hours / hoursPerHighestPoint) * highestPoint
  return (hours / hoursPerHighestPoint) * highestPoint;
}

/**
 * Converts decimal hours to hours and minutes format
 *
 * @param hours - The decimal hours to convert
 * @returns Object with hours and minutes
 *
 * @example
 * convertHoursToHoursAndMinutes(41.41); // Returns { hours: 41, minutes: 25 }
 */
export function convertHoursToHoursAndMinutes(hours: number): { hours: number; minutes: number } {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return { hours: wholeHours, minutes };
}
