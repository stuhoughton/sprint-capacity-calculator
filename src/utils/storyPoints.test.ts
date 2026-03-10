import { describe, it, expect } from 'vitest';
import { convertHoursToStoryPoints, convertStoryPointsToHours } from './storyPoints';
import { StoryPointScale } from '../types/index';
import fc from 'fast-check';

describe('Story Point Conversion Functions', () => {
  // Default story point scale from requirements
  const defaultScale: StoryPointScale = {
    '1': 1,
    '3': 4,
    '5': 8,
    '8': 12,
    '10': 16,
  };

  describe('convertHoursToStoryPoints', () => {
    describe('with default scale', () => {
      it('should convert exact hour values to their corresponding story points', () => {
        expect(convertHoursToStoryPoints(1, defaultScale)).toBe(1);
        expect(convertHoursToStoryPoints(4, defaultScale)).toBe(3);
        expect(convertHoursToStoryPoints(8, defaultScale)).toBe(5);
        expect(convertHoursToStoryPoints(12, defaultScale)).toBe(8);
        expect(convertHoursToStoryPoints(16, defaultScale)).toBe(10);
      });

      it('should round to the nearest story point for intermediate values', () => {
        // 2 hours is between 1 (1h) and 3 (4h), closer to 1
        expect(convertHoursToStoryPoints(2, defaultScale)).toBe(1);

        // 2.5 hours is equidistant from 1 (1h) and 3 (4h), returns first found (1)
        expect(convertHoursToStoryPoints(2.5, defaultScale)).toBe(1);

        // 3 hours is between 1 (1h) and 3 (4h), closer to 3
        expect(convertHoursToStoryPoints(3, defaultScale)).toBe(3);

        // 6 hours is equidistant from 3 (4h) and 5 (8h), returns first found (3)
        expect(convertHoursToStoryPoints(6, defaultScale)).toBe(3);

        // 7 hours is between 3 (4h) and 5 (8h), closer to 5
        expect(convertHoursToStoryPoints(7, defaultScale)).toBe(5);

        // 10 hours is equidistant from 5 (8h) and 8 (12h), returns first found (5)
        expect(convertHoursToStoryPoints(10, defaultScale)).toBe(5);

        // 11 hours is between 5 (8h) and 8 (12h), closer to 8
        expect(convertHoursToStoryPoints(11, defaultScale)).toBe(8);

        // 14 hours is between 8 (12h) and 10 (16h), closer to 8
        expect(convertHoursToStoryPoints(14, defaultScale)).toBe(8);

        // 15 hours is between 8 (12h) and 10 (16h), closer to 10
        expect(convertHoursToStoryPoints(15, defaultScale)).toBe(10);
      });

      it('should handle zero hours', () => {
        expect(convertHoursToStoryPoints(0, defaultScale)).toBe(1);
      });

      it('should handle very small decimal values', () => {
        expect(convertHoursToStoryPoints(0.5, defaultScale)).toBe(1);
      });

      it('should handle large hour values', () => {
        // 100 hours is much closer to 10 (16h) than any other point
        expect(convertHoursToStoryPoints(100, defaultScale)).toBe(10);
      });

      it('should handle negative hours (edge case)', () => {
        // -5 hours is closest to 1 (1h)
        expect(convertHoursToStoryPoints(-5, defaultScale)).toBe(1);
      });
    });

    describe('with custom scales', () => {
      it('should work with custom story point scales', () => {
        const customScale: StoryPointScale = {
          '1': 2,
          '3': 6,
          '5': 10,
          '8': 16,
          '10': 20,
        };

        expect(convertHoursToStoryPoints(2, customScale)).toBe(1);
        expect(convertHoursToStoryPoints(6, customScale)).toBe(3);
        expect(convertHoursToStoryPoints(10, customScale)).toBe(5);
        expect(convertHoursToStoryPoints(16, customScale)).toBe(8);
        expect(convertHoursToStoryPoints(20, customScale)).toBe(10);
      });

      it('should work with non-standard story point values', () => {
        const customScale: StoryPointScale = {
          '1': 0.5,
          '3': 1.5,
          '5': 3,
          '8': 5,
          '10': 8,
        };

        expect(convertHoursToStoryPoints(0.5, customScale)).toBe(1);
        expect(convertHoursToStoryPoints(1.5, customScale)).toBe(3);
        expect(convertHoursToStoryPoints(3, customScale)).toBe(5);
      });

      it('should handle scales with decimal hour values', () => {
        const customScale: StoryPointScale = {
          '1': 1.5,
          '3': 4.5,
          '5': 8.5,
          '8': 12.5,
          '10': 16.5,
        };

        expect(convertHoursToStoryPoints(1.5, customScale)).toBe(1);
        expect(convertHoursToStoryPoints(4.5, customScale)).toBe(3);
        expect(convertHoursToStoryPoints(8.5, customScale)).toBe(5);
      });
    });

    describe('edge cases', () => {
      it('should handle empty scale gracefully', () => {
        const emptyScale: StoryPointScale = {
          '1': 0,
          '3': 0,
          '5': 0,
          '8': 0,
          '10': 0,
        };

        // Should return the first point (1) when all values are 0
        expect(convertHoursToStoryPoints(5, emptyScale)).toBe(1);
      });

      it('should handle very close hour values (tie-breaking)', () => {
        const scale: StoryPointScale = {
          '1': 5,
          '3': 5,
          '5': 8,
          '8': 12,
          '10': 16,
        };

        // When two points are equally close, should return the first one found
        const result = convertHoursToStoryPoints(5, scale);
        expect([1, 3]).toContain(result);
      });
    });
  });

  describe('convertStoryPointsToHours', () => {
    describe('with default scale', () => {
      it('should convert valid story point values to hours', () => {
        expect(convertStoryPointsToHours(1, defaultScale)).toBe(1);
        expect(convertStoryPointsToHours(3, defaultScale)).toBe(4);
        expect(convertStoryPointsToHours(5, defaultScale)).toBe(8);
        expect(convertStoryPointsToHours(8, defaultScale)).toBe(12);
        expect(convertStoryPointsToHours(10, defaultScale)).toBe(16);
      });

      it('should return 0 for invalid story point values', () => {
        expect(convertStoryPointsToHours(2, defaultScale)).toBe(0);
        expect(convertStoryPointsToHours(4, defaultScale)).toBe(0);
        expect(convertStoryPointsToHours(7, defaultScale)).toBe(0);
        expect(convertStoryPointsToHours(13, defaultScale)).toBe(0);
        expect(convertStoryPointsToHours(100, defaultScale)).toBe(0);
      });

      it('should handle zero story points', () => {
        expect(convertStoryPointsToHours(0, defaultScale)).toBe(0);
      });

      it('should handle negative story points', () => {
        expect(convertStoryPointsToHours(-5, defaultScale)).toBe(0);
      });
    });

    describe('with custom scales', () => {
      it('should work with custom story point scales', () => {
        const customScale: StoryPointScale = {
          '1': 2,
          '3': 6,
          '5': 10,
          '8': 16,
          '10': 20,
        };

        expect(convertStoryPointsToHours(1, customScale)).toBe(2);
        expect(convertStoryPointsToHours(3, customScale)).toBe(6);
        expect(convertStoryPointsToHours(5, customScale)).toBe(10);
        expect(convertStoryPointsToHours(8, customScale)).toBe(16);
        expect(convertStoryPointsToHours(10, customScale)).toBe(20);
      });

      it('should work with decimal hour values in scale', () => {
        const customScale: StoryPointScale = {
          '1': 1.5,
          '3': 4.5,
          '5': 8.5,
          '8': 12.5,
          '10': 16.5,
        };

        expect(convertStoryPointsToHours(1, customScale)).toBe(1.5);
        expect(convertStoryPointsToHours(3, customScale)).toBe(4.5);
        expect(convertStoryPointsToHours(5, customScale)).toBe(8.5);
      });
    });
  });

  describe('Round-trip conversion', () => {
    it('should convert hours to points and back to hours (within rounding)', () => {
      // Exact values should round-trip perfectly
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(1, defaultScale), defaultScale)).toBe(1);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(4, defaultScale), defaultScale)).toBe(4);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(8, defaultScale), defaultScale)).toBe(8);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(12, defaultScale), defaultScale)).toBe(12);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(16, defaultScale), defaultScale)).toBe(16);
    });

    it('should handle intermediate values in round-trip conversion', () => {
      // 6 hours -> 5 points -> 8 hours (rounding effect)
      const points = convertHoursToStoryPoints(6, defaultScale);
      const hours = convertStoryPointsToHours(points, defaultScale);
      expect(hours).toBeGreaterThan(0);
      expect(typeof hours).toBe('number');
    });

    it('should work with custom scales in round-trip', () => {
      const customScale: StoryPointScale = {
        '1': 2,
        '3': 6,
        '5': 10,
        '8': 16,
        '10': 20,
      };

      expect(convertStoryPointsToHours(convertHoursToStoryPoints(2, customScale), customScale)).toBe(2);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(6, customScale), customScale)).toBe(6);
      expect(convertStoryPointsToHours(convertHoursToStoryPoints(10, customScale), customScale)).toBe(10);
    });
  });

  describe('Integration with capacity calculations', () => {
    it('should handle typical capacity values', () => {
      // Typical team member capacity values
      const capacities = [56.84, 69.34, 59.34, 72.34];

      capacities.forEach((capacity) => {
        const points = convertHoursToStoryPoints(capacity, defaultScale);
        expect(points).toBeGreaterThan(0);
        expect([1, 3, 5, 8, 10]).toContain(points);
      });
    });

    it('should handle zero capacity', () => {
      const points = convertHoursToStoryPoints(0, defaultScale);
      expect(points).toBe(1);
    });

    it('should handle very high capacity values', () => {
      const points = convertHoursToStoryPoints(200, defaultScale);
      expect(points).toBe(10);
    });
  });

  describe('Property-based tests', () => {
    it('Property 3: Story point conversion is reversible', () => {
      // **Validates: Requirements 3.4, 3.5**
      fc.assert(
        fc.property(
          fc.float({ min: 0, max: 1000 }),
          (hours: number) => {
            // Convert hours to story points and back
            const points = convertHoursToStoryPoints(hours, defaultScale);
            const convertedBack = convertStoryPointsToHours(points, defaultScale);

            // The converted back value should be a valid story point hour value
            expect(convertedBack).toBeGreaterThanOrEqual(0);
            expect([1, 4, 8, 12, 16]).toContain(convertedBack);

            // For exact story point values, round-trip should be perfect
            if ([1, 4, 8, 12, 16].includes(hours)) {
              expect(convertedBack).toBe(hours);
            }
          }
        )
      );
    });
  });
});
