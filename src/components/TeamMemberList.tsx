import React, { useState } from 'react';
import { useAppContext } from '../context';
import { TeamMemberCard } from './TeamMemberCard';
import { validateTeamMemberName } from '../utils/validation';

/**
 * TeamMemberList - Renders list of TeamMemberCard components with "Add Team Member" button
 * Handles adding new team members with unique IDs
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export const TeamMemberList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const handleAddMember = () => {
    const validation = validateTeamMemberName(newMemberName);

    if (!validation.isValid) {
      setNameError(validation.errorMessage || 'Invalid name');
      return;
    }

    setNameError('');
    dispatch({
      type: 'ADD_TEAM_MEMBER',
      payload: { name: newMemberName },
    });
    setNewMemberName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
  };

  return (
    <div className="space-y-4">
      {/* Team Members List */}
      <div className="space-y-4">
        {state.teamMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No team members added yet. Add one to get started.
          </p>
        ) : (
          state.teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))
        )}
      </div>

      {/* Add Team Member Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
          Add Team Member
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => {
              setNewMemberName(e.target.value);
              setNameError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter team member name"
            className={`flex-1 px-3 py-2 md:py-3 border rounded font-medium text-base md:text-base min-h-[44px] md:min-h-auto ${
              nameError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            aria-label="New team member name"
          />
          <button
            onClick={handleAddMember}
            className="w-full sm:w-auto px-4 py-2 md:py-3 bg-green-600 text-white hover:bg-green-700 rounded font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Add team member"
          >
            Add
          </button>
        </div>
        {nameError && (
          <span className="text-red-600 text-xs mt-2 block">{nameError}</span>
        )}
      </div>
    </div>
  );
};
