import React, { useState } from 'react';
import { useAppContext } from '../context';
import { TeamMember } from '../types';
import { LeaveOccurrenceRow } from './LeaveOccurrenceRow';
import { MeetingOccurrenceRow } from './MeetingOccurrenceRow';
import { LeaveCalculatorModal } from './LeaveCalculatorModal';
import { MeetingCalculatorModal } from './MeetingCalculatorModal';
import { validateTeamMemberName } from '../utils/validation';

interface TeamMemberCardProps {
  member: TeamMember;
}

/**
 * TeamMemberCard - Displays team member information with editable name, leave/meeting lists, and delete button
 * Shows running totals for leave and meeting hours
 * Requirements: 6.1, 7.1, 8.1, 8.2, 8.3, 8.4
 */
export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const { dispatch } = useAppContext();
  const [nameError, setNameError] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMeetingCalculatorOpen, setIsMeetingCalculatorOpen] = useState(false);

  const totalLeaveHours = member.leaveOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );

  const totalMeetingHours = member.meetingOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateTeamMemberName(value);

    if (!validation.isValid) {
      setNameError(validation.errorMessage || 'Invalid name');
    } else {
      setNameError('');
      dispatch({
        type: 'UPDATE_TEAM_MEMBER_NAME',
        payload: { memberId: member.id, name: value },
      });
    }
  };

  const handleAddLeave = () => {
    dispatch({
      type: 'ADD_LEAVE',
      payload: { memberId: member.id, hours: 0 },
    });
  };

  const handleAddLeaveFromCalculator = (hours: number) => {
    dispatch({
      type: 'ADD_LEAVE',
      payload: { memberId: member.id, hours },
    });
  };

  const handleAddMeeting = () => {
    dispatch({
      type: 'ADD_MEETING',
      payload: { memberId: member.id, hours: 0 },
    });
  };

  const handleAddMeetingFromCalculator = (hours: number) => {
    dispatch({
      type: 'ADD_MEETING',
      payload: { memberId: member.id, hours },
    });
  };

  const handleDeleteMember = () => {
    dispatch({
      type: 'REMOVE_TEAM_MEMBER',
      payload: { memberId: member.id },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with name and delete button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Team Member Name
          </label>
          <input
            type="text"
            value={member.name}
            onChange={handleNameChange}
            placeholder="Enter name"
            className={`w-full px-3 py-2 md:py-3 border rounded font-medium text-base md:text-base min-h-[44px] md:min-h-auto ${
              nameError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            aria-label="Team member name"
          />
          {nameError && (
            <span className="text-red-600 text-xs mt-1 block">{nameError}</span>
          )}
        </div>
        <button
          onClick={handleDeleteMember}
          className="w-full sm:w-auto px-4 py-2 md:py-3 text-red-600 hover:bg-red-50 rounded border border-red-200 font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
          aria-label="Delete team member"
        >
          Delete
        </button>
      </div>

      {/* Leave Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700 text-sm md:text-base">
            Annual Leave
          </h3>
          <span className="text-sm font-medium text-blue-600">
            Total: {totalLeaveHours.toFixed(2)}h
          </span>
        </div>
        <div className="space-y-2 mb-3">
          {member.leaveOccurrences.length === 0 ? (
            <p className="text-gray-500 text-sm">No leave entries</p>
          ) : (
            member.leaveOccurrences.map((leave) => (
              <LeaveOccurrenceRow
                key={leave.id}
                memberId={member.id}
                leaveId={leave.id}
                hours={leave.hours}
              />
            ))
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddLeave}
            className="flex-1 px-4 py-2 md:py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Add leave occurrence"
          >
            + Add Leave
          </button>
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="px-4 py-2 md:py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded border border-green-200 font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Open leave calculator"
            title="Calculate leave hours"
          >
            🧮
          </button>
        </div>

        {/* Leave Calculator Modal */}
        <LeaveCalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          onAddLeave={handleAddLeaveFromCalculator}
        />
      </div>

      {/* Meeting Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700 text-sm md:text-base">
            Meetings
          </h3>
          <span className="text-sm font-medium text-blue-600">
            Total: {totalMeetingHours.toFixed(2)}h
          </span>
        </div>
        <div className="space-y-2 mb-3">
          {member.meetingOccurrences.length === 0 ? (
            <p className="text-gray-500 text-sm">No meeting entries</p>
          ) : (
            member.meetingOccurrences.map((meeting) => (
              <MeetingOccurrenceRow
                key={meeting.id}
                memberId={member.id}
                meetingId={meeting.id}
                hours={meeting.hours}
              />
            ))
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddMeeting}
            className="flex-1 px-4 py-2 md:py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Add meeting occurrence"
          >
            + Add Meeting
          </button>
          <button
            onClick={() => setIsMeetingCalculatorOpen(true)}
            className="px-4 py-2 md:py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded border border-green-200 font-medium text-sm transition-colors min-h-[44px] md:min-h-auto flex items-center justify-center"
            aria-label="Open meeting calculator"
            title="Calculate meeting hours"
          >
            🧮
          </button>
        </div>

        {/* Meeting Calculator Modal */}
        <MeetingCalculatorModal
          isOpen={isMeetingCalculatorOpen}
          onClose={() => setIsMeetingCalculatorOpen(false)}
          onAddMeeting={handleAddMeetingFromCalculator}
        />
      </div>
    </div>
  );
};
