import React, { useState } from 'react';
import { useAppContext } from '../context';
import { validateHours } from '../utils/validation';

interface LeaveOccurrenceRowProps {
  memberId: string;
  leaveId: string;
  hours: number;
  onEdit?: () => void;
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
  onEdit,
}) => {
  const { dispatch } = useAppContext();
  const [error, setError] = useState<string>('');
  const [editingHours, setEditingHours] = useState(hours.toString());

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditingHours(value);

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

  // Sync editingHours with the hours prop when it changes
  React.useEffect(() => {
    setEditingHours(hours.toString());
  }, [hours]);

  const handleEditInCalculator = () => {
    onEdit?.();
  };

  const handleDelete = () => {
    dispatch({
      type: 'REMOVE_LEAVE',
      payload: { memberId, leaveId },
    });
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-25 border border-green-200 rounded-lg p-3 md:p-4">
      {/* Hours Input */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="flex-1 w-full">
          <input
            type="number"
            value={editingHours}
            onChange={handleHoursChange}
            placeholder="0"
            step="0.5"
            min="0"
            className={`w-full px-3 py-2 md:py-3 border rounded text-base md:text-sm font-medium min-h-[44px] md:min-h-auto ${
              error ? 'border-red-500 bg-red-50' : 'border-green-200 bg-white'
            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
            aria-label="Leave hours"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleEditInCalculator}
            className="flex-1 sm:flex-none px-3 py-2 md:py-3 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 text-sm font-medium transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Edit leave in calculator"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 sm:flex-none px-3 py-2 md:py-3 text-red-600 hover:bg-red-50 rounded border border-red-200 text-sm font-medium transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Delete leave occurrence"
          >
            Delete
          </button>
        </div>
      </div>

      {error && <span className="text-red-600 text-xs mt-2 block">{error}</span>}
    </div>
  );
};
