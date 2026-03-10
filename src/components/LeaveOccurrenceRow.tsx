import React, { useState } from 'react';
import { useAppContext } from '../context';
import { validateHours } from '../utils/validation';

interface LeaveOccurrenceRowProps {
  memberId: string;
  leaveId: string;
  hours: number;
}

/**
 * LeaveOccurrenceRow - Displays a single leave entry with hours input and delete button
 * Implements real-time validation for hours input
 * Requirements: 8.2, 8.5, 15.1, 15.2
 */
export const LeaveOccurrenceRow: React.FC<LeaveOccurrenceRowProps> = ({
  memberId,
  leaveId,
  hours,
}) => {
  const { dispatch } = useAppContext();
  const [error, setError] = useState<string>('');

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input (will be treated as 0)
    if (value === '') {
      setError('');
      dispatch({
        type: 'UPDATE_LEAVE',
        payload: { memberId, leaveId, hours: 0 },
      });
      return;
    }

    const validation = validateHours(value);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid input');
    } else {
      setError('');
      dispatch({
        type: 'UPDATE_LEAVE',
        payload: { memberId, leaveId, hours: parseFloat(value) },
      });
    }
  };

  const handleDelete = () => {
    dispatch({
      type: 'REMOVE_LEAVE',
      payload: { memberId, leaveId },
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <input
        type="number"
        value={hours || ''}
        onChange={handleHoursChange}
        placeholder="0"
        step="0.5"
        min="0"
        className={`flex-1 px-3 py-2 md:py-3 border rounded text-base md:text-sm font-medium min-h-[44px] md:min-h-auto ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        aria-label="Leave hours"
      />
      <button
        onClick={handleDelete}
        className="w-full sm:w-auto px-4 py-2 md:py-3 md:px-3 text-red-600 hover:bg-red-50 rounded border border-red-200 text-sm font-medium transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
        aria-label="Delete leave occurrence"
      >
        Delete
      </button>
      {error && <span className="text-red-600 text-xs mt-1 block">{error}</span>}
    </div>
  );
};
