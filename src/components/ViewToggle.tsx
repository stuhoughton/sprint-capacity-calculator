import React from 'react';

interface ViewToggleProps {
  viewInPoints: boolean;
  onToggle: (viewInPoints: boolean) => void;
}

/**
 * ViewToggle - Toggle between hours and story points view
 * Updates displayed values based on selection
 * Requirements: 3.1
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewInPoints,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
      <button
        onClick={() => onToggle(false)}
        className={`px-3 md:px-4 py-2 md:py-2 rounded font-medium text-sm md:text-sm min-h-[44px] md:min-h-auto flex items-center justify-center transition-colors ${
          !viewInPoints
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-pressed={!viewInPoints}
        aria-label="View capacity in hours"
      >
        Hours
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-3 md:px-4 py-2 md:py-2 rounded font-medium text-sm md:text-sm min-h-[44px] md:min-h-auto flex items-center justify-center transition-colors ${
          viewInPoints
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-pressed={viewInPoints}
        aria-label="View capacity in story points"
      >
        Story Points
      </button>
    </div>
  );
};
