import React, { useState } from 'react';
import { useAppContext } from '../context';
import { validateBaseHours } from '../utils/validation';

/**
 * BaseHoursInput - Display editable field for base hours
 * Shows default value (72.34)
 * Implements validation and error display
 * Dispatches UPDATE_BASE_HOURS action on change
 * Requirements: 4.1, 4.2, 4.3, 4.4, 15.3
 */
export const BaseHoursInput: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Validate input
    const validation = validateBaseHours(value);

    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid base hours');
    } else {
      setError('');
      const baseHours = parseFloat(value);
      dispatch({
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours },
      });
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Base Hours Per Sprint
      </label>
      <p className="text-xs text-gray-600 mb-3">
        Standard working hours per team member per sprint (default: 72.34 hours)
      </p>
      <input
        type="number"
        value={state.config.baseHours}
        onChange={handleChange}
        step="0.01"
        min="0"
        placeholder="72.34"
        className={`w-full px-3 py-2 md:py-3 border rounded font-medium text-base md:text-base min-h-[44px] md:min-h-auto ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        aria-label="Base hours per sprint"
      />
      {error && (
        <span className="text-red-600 text-xs mt-2 block">{error}</span>
      )}
    </div>
  );
};
