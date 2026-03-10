/**
 * localStorage manager utility for Sprint Capacity Calculator
 * Handles persistence, versioning, and error handling for application state
 */

import { AppState } from '../types';

// Versioned storage key to prevent conflicts with other applications
const STORAGE_KEY = 'sprint-capacity-calculator:v1';

/**
 * Custom error class for quota exceeded errors
 */
export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuotaExceededError';
  }
}

/**
 * Custom error class for JSON parse errors
 */
export class JSONParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JSONParseError';
  }
}

/**
 * Saves application state to localStorage
 * Handles quota exceeded and serialization errors gracefully
 *
 * @param state - The application state to save
 * @throws {QuotaExceededError} When localStorage quota is exceeded
 * @throws {Error} For other serialization errors
 */
export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error) {
      // Check for quota exceeded error
      if (
        error.name === 'QuotaExceededError' ||
        error.message.includes('QuotaExceededError') ||
        error.message.includes('quota')
      ) {
        throw new QuotaExceededError(
          'Storage quota exceeded. Unable to save data. Please clear some data and try again.'
        );
      }
      throw error;
    }
    throw new Error('Failed to save state to localStorage');
  }
}

/**
 * Loads application state from localStorage
 * Returns null if no state is found or if data is corrupted
 * Handles JSON parse errors gracefully
 *
 * @returns The loaded application state, or null if not found or corrupted
 * @throws {JSONParseError} When stored data cannot be parsed as JSON
 */
export function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);

    // No data found
    if (!serialized) {
      return null;
    }

    // Parse and return the state
    return JSON.parse(serialized) as AppState;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // JSON parse error - data is corrupted
      console.error('Corrupted data in localStorage. Clearing corrupted state.');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (clearError) {
        console.error('Failed to clear corrupted data:', clearError);
      }
      throw new JSONParseError(
        'Stored data is corrupted and cannot be loaded. Starting with fresh data.'
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to load state from localStorage');
  }
}

/**
 * Clears all application data from localStorage
 * Handles errors gracefully
 *
 * @throws {Error} If clearing fails for reasons other than item not existing
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to clear state from localStorage');
  }
}
