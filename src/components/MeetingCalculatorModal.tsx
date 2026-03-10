import React, { useState } from 'react';

interface MeetingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeeting: (hours: number) => void;
}

export const MeetingCalculatorModal: React.FC<MeetingCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAddMeeting,
}) => {
  const [meetingName, setMeetingName] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [occurrences, setOccurrences] = useState('1');

  const calculateHours = (): number => {
    const dur = parseFloat(duration) || 0;
    if (dur === 0) return 0;

    const durationInHours = durationUnit === 'minutes' ? dur / 60 : dur;
    const occurrenceCount = parseFloat(occurrences) || 1;
    return durationInHours * occurrenceCount;
  };

  const handleAddMeeting = () => {
    const hours = calculateHours();
    if (hours > 0) {
      onAddMeeting(hours);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setMeetingName('');
    setDuration('');
    setDurationUnit('minutes');
    setOccurrences('1');
  };

  if (!isOpen) return null;

  const totalHours = calculateHours();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Add Meeting</h2>

        {/* Meeting Name (Optional) */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Meeting Name (Optional)</label>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="e.g. Team Standup, Client Call"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          />
        </div>

        {/* Duration Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Duration</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              min="0"
              step="0.25"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as 'minutes' | 'hours')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        </div>

        {/* Recurrence Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700">How many times this week?</label>
          <input
            type="number"
            min="1"
            step="1"
            value={occurrences}
            onChange={(e) => setOccurrences(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          />
        </div>

        {/* Total Hours Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-2xl font-bold text-blue-900">{totalHours.toFixed(2)} hrs</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMeeting}
            disabled={totalHours === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Meeting
          </button>
        </div>
      </div>
    </div>
  );
};
