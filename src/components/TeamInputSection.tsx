import React from 'react';
import { TeamMemberList } from './TeamMemberList';

/**
 * TeamInputSection - Wraps TeamMemberList component with section header and layout
 * Provides the main interface for managing team members
 * Requirements: 6.1, 7.1, 8.1
 */
export const TeamInputSection: React.FC = () => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
          Team Members
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Add team members and their leave/meeting hours
        </p>
      </div>
      <TeamMemberList />
    </section>
  );
};
