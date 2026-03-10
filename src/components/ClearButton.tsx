import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * ClearButton component
 * Displays clear all data button
 * Shows confirmation dialog before clearing
 * Dispatches CLEAR_ALL_DATA action on confirmation
 * Requirements: 16.1, 16.2, 16.3
 */
export function ClearButton() {
  const { dispatch } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClear = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={handleClear}
          className="w-full sm:w-auto px-4 py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm md:text-base min-h-[44px] md:min-h-auto flex items-center justify-center"
          title="Confirm clearing all data"
        >
          Confirm Clear
        </button>
        <button
          onClick={() => setShowConfirmation(false)}
          className="w-full sm:w-auto px-4 py-2 md:py-3 bg-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-400 active:bg-neutral-500 transition-colors font-medium text-sm md:text-base min-h-[44px] md:min-h-auto flex items-center justify-center"
          title="Cancel clearing data"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className="w-full sm:w-auto px-4 py-2 md:py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 active:bg-neutral-800 transition-colors font-medium text-sm md:text-base min-h-[44px] md:min-h-auto flex items-center justify-center"
      title="Clear all team data and start fresh"
    >
      Clear All Data
    </button>
  );
}
