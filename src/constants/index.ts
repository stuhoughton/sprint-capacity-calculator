/**
 * Application constants and default values
 */

import { Config, StoryPointScale } from '../types';

/**
 * Default story point scale mapping
 * 1 point = 1 hour
 * 3 points = 4 hours
 * 5 points = 8 hours
 * 8 points = 12 hours
 * 10 points = 16 hours
 */
const DEFAULT_STORY_POINT_SCALE: StoryPointScale = {
  '1': 1,
  '3': 4,
  '5': 8,
  '8': 12,
  '10': 16,
};

/**
 * Default application configuration
 * Base hours: 72.34 hours per sprint (36.17 hours/week × 2 weeks)
 */
export const DEFAULT_CONFIG: Config = {
  baseHours: 72.34,
  storyPointScale: DEFAULT_STORY_POINT_SCALE,
};

/**
 * localStorage key for persisting application state
 */
export const STORAGE_KEY = 'sprint-capacity-calculator:v1';

/**
 * Valid story point values
 */
export const VALID_STORY_POINTS = ['1', '3', '5', '8', '10'] as const;
