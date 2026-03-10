import React, { useState } from 'react';
import { useAppContext } from '../context';
import { StoryPointScale } from '../types';
import { validateStoryPointValue } from '../utils/validation';

/**
 * StoryPointScaleInput - Display editable fields for each story point value
 * Shows default mappings (1pt=1h, 3pt=4h, 5pt=8h, 8pt=12h, 10pt=16h)
 * Implements validation for positive numbers
 * Dispatches UPDATE_STORY_POINT_SCALE action on change
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 15.3
 */
export const StoryPointScaleInput: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const storyPoints = ['1', '3', '5', '8', '10'] as const;

  const handleScaleChange = (point: string, value: string) => {
    // Validate input
    const validation = validateStoryPointValue(value);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [point]: validation.errorMessage || 'Invalid value',
      }));
    } else {
      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[point];
        return newErrors;
      });

      // Update the scale
      const newScale: StoryPointScale = {
        ...state.config.storyPointScale,
        [point]: parseFloat(value),
      };

      dispatch({
        type: 'UPDATE_STORY_POINT_SCALE',
        payload: { scale: newScale },
      });
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Story Point Scale
      </label>
      <p className="text-xs text-gray-600 mb-4">
        Configure the mapping between story points and hours
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storyPoints.map((point) => (
          <div key={point}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {point} point = ? hours
            </label>
            <input
              type="number"
              value={state.config.storyPointScale[point]}
              onChange={(e) => handleScaleChange(point, e.target.value)}
              step="0.01"
              min="0"
              placeholder="0"
              className={`w-full px-3 py-2 md:py-3 border rounded font-medium text-base md:text-base min-h-[44px] md:min-h-auto ${
                errors[point]
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              aria-label={`Story point ${point} value in hours`}
            />
            {errors[point] && (
              <span className="text-red-600 text-xs mt-1 block">
                {errors[point]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
