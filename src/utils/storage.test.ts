/**
 * Unit tests for localStorage manager utility
 * Tests saveState, loadState, and clearState functions
 * Validates error handling for quota exceeded and JSON parse errors
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveState, loadState, clearState, QuotaExceededError, JSONParseError } from './storage';
import { AppState, Config, StoryPointScale } from '../types';
import fc from 'fast-check';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Helper to create a valid AppState for testing
function createTestState(): AppState {
  const storyPointScale: StoryPointScale = {
    '1': 1,
    '3': 4,
    '5': 8,
    '8': 12,
    '10': 16,
  };

  const config: Config = {
    baseHours: 72.34,
    storyPointScale,
  };

  return {
    teamMembers: [
      {
        id: 'member-1',
        name: 'Alice Johnson',
        leaveOccurrences: [
          { id: 'leave-1', hours: 8 },
          { id: 'leave-2', hours: 4 },
        ],
        meetingOccurrences: [
          { id: 'meeting-1', hours: 2 },
          { id: 'meeting-2', hours: 1.5 },
        ],
      },
      {
        id: 'member-2',
        name: 'Bob Smith',
        leaveOccurrences: [],
        meetingOccurrences: [{ id: 'meeting-3', hours: 3 }],
      },
    ],
    config,
  };
}

describe('localStorage manager utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveState', () => {
    it('should save state to localStorage with versioned key', () => {
      const state = createTestState();
      saveState(state);

      const stored = localStorage.getItem('sprint-capacity-calculator:v1');
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed.teamMembers).toHaveLength(2);
      expect(parsed.config.baseHours).toBe(72.34);
    });

    it('should throw QuotaExceededError when quota is exceeded', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const state = createTestState();
      expect(() => saveState(state)).toThrow(QuotaExceededError);

      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadState', () => {
    it('should load state from localStorage', () => {
      const state = createTestState();
      saveState(state);

      const loaded = loadState();

      expect(loaded).toBeDefined();
      expect(loaded?.teamMembers).toHaveLength(2);
      expect(loaded?.teamMembers[0].name).toBe('Alice Johnson');
    });

    it('should return null when no state is stored', () => {
      const loaded = loadState();
      expect(loaded).toBeNull();
    });

    it('should throw JSONParseError when stored data is corrupted', () => {
      localStorage.setItem('sprint-capacity-calculator:v1', 'invalid json {');

      expect(() => loadState()).toThrow(JSONParseError);
    });

    it('should clear corrupted data from localStorage', () => {
      localStorage.setItem('sprint-capacity-calculator:v1', 'invalid json {');

      try {
        loadState();
      } catch {
        // Expected to throw
      }

      const stored = localStorage.getItem('sprint-capacity-calculator:v1');
      expect(stored).toBeNull();
    });
  });

  describe('clearState', () => {
    it('should remove state from localStorage', () => {
      const state = createTestState();
      saveState(state);

      expect(localStorage.getItem('sprint-capacity-calculator:v1')).not.toBeNull();

      clearState();

      expect(localStorage.getItem('sprint-capacity-calculator:v1')).toBeNull();
    });

    it('should not throw error when clearing non-existent state', () => {
      expect(() => clearState()).not.toThrow();
    });
  });

  describe('versioned storage key', () => {
    it('should use versioned key to prevent conflicts', () => {
      const state = createTestState();
      saveState(state);

      const stored = localStorage.getItem('sprint-capacity-calculator:v1');
      expect(stored).not.toBeNull();

      localStorage.setItem('other-app:v1', 'other data');
      expect(localStorage.getItem('other-app:v1')).toBe('other data');
      expect(localStorage.getItem('sprint-capacity-calculator:v1')).toBe(stored);
    });
  });

  describe('error handling edge cases', () => {
    it('should handle state with empty arrays and zero values', () => {
      const state = createTestState();
      state.teamMembers = [];
      state.config.baseHours = 0;

      saveState(state);
      const loaded = loadState();

      expect(loaded?.teamMembers).toHaveLength(0);
      expect(loaded?.config.baseHours).toBe(0);
    });
  });
});

describe('Property-based tests for storage', () => {
  it('Property 2: State round-trip consistency', () => {
    // **Validates: Requirements 10.1, 10.2, 10.3**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            leaveOccurrences: fc.array(
              fc.record({
                id: fc.uuid(),
                hours: fc.float({ min: 0, max: 100 }),
              }),
              { maxLength: 5 }
            ),
            meetingOccurrences: fc.array(
              fc.record({
                id: fc.uuid(),
                hours: fc.float({ min: 0, max: 100 }),
              }),
              { maxLength: 5 }
            ),
          }),
          { maxLength: 10 }
        ),
        (teamMembers) => {
          const state: AppState = {
            teamMembers: teamMembers as any,
            config: {
              baseHours: 72.34,
              storyPointScale: {
                '1': 1,
                '3': 4,
                '5': 8,
                '8': 12,
                '10': 16,
              },
            },
          };

          // Save and load state
          saveState(state);
          const loaded = loadState();

          // Verify round-trip consistency
          expect(loaded).toBeDefined();
          expect(loaded).not.toBeNull();
          expect(JSON.stringify(loaded)).toBe(JSON.stringify(state));
        }
      )
    );
  });
});
