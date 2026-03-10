import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context';
import { StoryPointScale } from '../types';
import { calculateTeamCapacitySummary } from '../utils/calculations';
import { convertHoursToStoryPoints } from '../utils/storyPoints';
import { CapacityTable } from './CapacityTable';
import { ViewToggle } from './ViewToggle';

/**
 * CapacitySummarySection - Renders ViewToggle and CapacityTable
 * Passes capacity data to table with story point conversion support
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export const CapacitySummarySection: React.FC = () => {
  const { state } = useAppContext();
  const [viewInPoints, setViewInPoints] = useState(false);

  // Calculate capacity summary with memoization
  const summary = useMemo(() => {
    const baseSummary = calculateTeamCapacitySummary(
      state.teamMembers,
      state.config.baseHours
    );

    // Add story point conversions if needed
    if (viewInPoints) {
      const membersWithPoints = baseSummary.members.map((member) => ({
        ...member,
        availableCapacityInPoints: convertHoursToStoryPoints(
          member.availableCapacity,
          state.config.storyPointScale
        ),
      }));

      const totalAvailableCapacityInPoints = convertHoursToStoryPoints(
        baseSummary.totals.totalAvailableCapacity,
        state.config.storyPointScale
      );

      return {
        members: membersWithPoints,
        totals: {
          ...baseSummary.totals,
          totalAvailableCapacityInPoints,
        },
      };
    }

    return baseSummary;
  }, [state.teamMembers, state.config, viewInPoints]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Team Capacity Summary
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            View total team capacity and individual member breakdown
          </p>
        </div>
        <ViewToggle viewInPoints={viewInPoints} onToggle={setViewInPoints} />
      </div>

      {state.teamMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No team members added yet. Add team members to see capacity summary.
          </p>
        </div>
      ) : (
        <CapacityTable 
          summary={summary} 
          viewInPoints={viewInPoints}
          storyPointScale={state.config.storyPointScale as StoryPointScale}
        />
      )}
    </div>
  );
};
