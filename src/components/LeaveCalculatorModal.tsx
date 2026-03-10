import React, { useState } from 'react';

interface LeaveCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeave: (hours: number) => void;
  editingLeaveHours?: number;
  onUpdateLeave?: (hours: number) => void;
}

type LeaveType = 'fullDay' | 'partDay' | 'customHours';

export const LeaveCalculatorModal: React.FC<LeaveCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAddLeave,
  editingLeaveHours,
  onUpdateLeave,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('fullDay');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [customHours, setCustomHours] = useState('');
  const [weeks, setWeeks] = useState('1');

  const isEditing = editingLeaveHours !== undefined;

  const dayHours: Record<string, number> = {
    Monday: 7.67,
    Tuesday: 7.67,
    Wednesday: 7.67,
    Thursday: 7.67,
    Friday: 7.08,
  };

  const calculateHours = (): number => {
    if (leaveType === 'customHours') {
      return parseFloat(customHours) || 0;
    }

    if (selectedDays.size === 0) return 0;

    const selectedDaysList = Array.from(selectedDays);
    const totalHours = selectedDaysList.reduce((sum, day) => {
      const dayHour = dayHours[day];
      return sum + (leaveType === 'partDay' ? dayHour / 2 : dayHour);
    }, 0);

    const weeksMultiplier = parseFloat(weeks) || 1;
    return totalHours * weeksMultiplier;
  };

  const toggleDay = (day: string) => {
    const newDays = new Set(selectedDays);
    if (newDays.has(day)) {
      newDays.delete(day);
    } else {
      newDays.add(day);
    }
    setSelectedDays(newDays);
  };

  const handleAddLeave = () => {
    const hours = calculateHours();
    if (hours > 0) {
      onAddLeave(hours);
      resetForm();
      setTimeout(() => onClose(), 0);
    }
  };

  const handleUpdateLeave = () => {
    const hours = calculateHours();
    if (hours > 0 && onUpdateLeave) {
      onUpdateLeave(hours);
      resetForm();
      setTimeout(() => onClose(), 0);
    }
  };

  const resetForm = () => {
    setLeaveType('fullDay');
    setSelectedDays(new Set());
    setCustomHours('');
    setWeeks('1');
  };

  if (!isOpen) return null;

  const totalHours = calculateHours();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">
          {isEditing ? 'Edit Leave' : 'Leave Calculator'}
        </h2>

        {/* Leave Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Leave Type</label>
          <div className="space-y-2">
            {(['fullDay', 'partDay', 'customHours'] as const).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="leaveType"
                  value={type}
                  checked={leaveType === type}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {type === 'fullDay' && 'Full Day(s)'}
                  {type === 'partDay' && 'Half Day(s)'}
                  {type === 'customHours' && 'Custom Hours'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Day Selection */}
        {leaveType !== 'customHours' && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Select Days</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(dayHours).map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDays.has(day)}
                    onChange={() => toggleDay(day)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Number of Weeks */}
        {leaveType !== 'customHours' && (
          <div>
            <label className="text-sm font-semibold text-gray-700">Number of Weeks</label>
            <input
              type="number"
              min="1"
              step="1"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
            />
          </div>
        )}

        {/* Custom Hours Input */}
        {leaveType === 'customHours' && (
          <div>
            <label className="text-sm font-semibold text-gray-700">Hours</label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              placeholder="Enter hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
            />
          </div>
        )}

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
            onClick={isEditing ? handleUpdateLeave : handleAddLeave}
            disabled={totalHours === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Leave' : 'Add Leave'}
          </button>
        </div>
      </div>
    </div>
  );
};
