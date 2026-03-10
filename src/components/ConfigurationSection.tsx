import React, { useState } from 'react';
import { BaseHoursInput } from './BaseHoursInput';
import { StoryPointScaleInput } from './StoryPointScaleInput';

/**
 * ConfigurationSection - Render BaseHoursInput and StoryPointScaleInput
 * Display validation error messages
 * Implement collapsible layout on mobile
 * Requirements: 4.1, 5.1, 12.1, 12.2, 12.3, 14.3
 */
export const ConfigurationSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Mobile: Collapsible header */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          aria-expanded={isExpanded}
          aria-label="Toggle configuration section"
        >
          <h2 className="text-lg font-bold text-gray-900">Configuration</h2>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="px-4 py-4 border-t border-gray-200 space-y-6">
            <BaseHoursInput />
            <StoryPointScaleInput />
          </div>
        )}
      </div>

      {/* Desktop: Always expanded */}
      <div className="hidden md:block p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Configuration</h2>
          <p className="text-gray-600 text-sm">
            Customise base hours and story point scale
          </p>
        </div>
        <BaseHoursInput />
        <StoryPointScaleInput />
      </div>
    </div>
  );
};
