import React from 'react';
import { TeamCapacitySummary } from '../types';
import { convertHoursToHoursAndMinutes, convertHoursToTotalStoryPoints } from '../utils/storyPoints';

interface CapacityTableProps {
  summary: TeamCapacitySummary;
  viewInPoints?: boolean;
  storyPointScale?: Record<string, number>;
}

/**
 * CapacityTable - Displays team capacity summary in a responsive table/card layout
 * Shows columns: Name, Base Hours, Leave Hours, Meeting Hours, Available Capacity
 * Includes totals row with sum calculations
 * Responsive: card-based on mobile, table on desktop
 * Requirements: 2.1, 2.2, 2.3, 2.4, 12.4, 12.5
 */
export const CapacityTable: React.FC<CapacityTableProps> = ({
  summary,
  viewInPoints = false,
  storyPointScale,
}) => {
  const formatHours = (hours: number) => {
    if (viewInPoints && storyPointScale) {
      const totalPoints = convertHoursToTotalStoryPoints(hours, storyPointScale);
      return Math.floor(totalPoints).toString();
    }
    return hours.toFixed(2);
  };

  const formatHoursWithMinutes = (hours: number) => {
    const { hours: h, minutes: m } = convertHoursToHoursAndMinutes(hours);
    return `${h}h ${m}m`;
  };

  const getCapacityValue = (member: typeof summary.members[0]) => {
    return formatHours(member.availableCapacity);
  };

  const getTotalCapacityValue = () => {
    return formatHours(summary.totals.totalAvailableCapacity);
  };

  const capacityUnit = viewInPoints ? 'pts' : 'h';

  return (
    <div className="w-full">
      {/* Mobile: Card-based view */}
      <div className="md:hidden space-y-3">
        {summary.members.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">
                {member.name}
              </h3>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">
                  {getCapacityValue(member)}{capacityUnit}
                </span>
                {!viewInPoints && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatHoursWithMinutes(member.availableCapacity)}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600">Base Hours</span>
                <p className="font-medium text-gray-900">
                  {member.baseHours.toFixed(2)}h
                </p>
                <p className="text-gray-500">{formatHoursWithMinutes(member.baseHours)}</p>
              </div>
              <div>
                <span className="text-gray-600">Leave Hours</span>
                <p className="font-medium text-gray-900">
                  {member.totalLeaveHours.toFixed(2)}h
                </p>
                <p className="text-gray-500">{formatHoursWithMinutes(member.totalLeaveHours)}</p>
              </div>
              <div>
                <span className="text-gray-600">Meeting Hours</span>
                <p className="font-medium text-gray-900">
                  {member.totalMeetingHours.toFixed(2)}h
                </p>
                <p className="text-gray-500">{formatHoursWithMinutes(member.totalMeetingHours)}</p>
              </div>
              <div>
                <span className="text-gray-600">Available</span>
                <p className="font-medium text-blue-600">
                  {getCapacityValue(member)}{capacityUnit}
                </p>
                {!viewInPoints && (
                  <p className="text-gray-500">{formatHoursWithMinutes(member.availableCapacity)}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Totals Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-900 text-sm">TOTAL</h3>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-700">
                {getTotalCapacityValue()}{capacityUnit}
              </span>
              {!viewInPoints && (
                <p className="text-xs text-gray-600 mt-1">
                  {formatHoursWithMinutes(summary.totals.totalAvailableCapacity)}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600">Base Hours</span>
              <p className="font-medium text-gray-900">
                {summary.totals.baseHours.toFixed(2)}h
              </p>
              <p className="text-gray-500">{formatHoursWithMinutes(summary.totals.baseHours)}</p>
            </div>
            <div>
              <span className="text-gray-600">Leave Hours</span>
              <p className="font-medium text-gray-900">
                {summary.totals.totalLeaveHours.toFixed(2)}h
              </p>
              <p className="text-gray-500">{formatHoursWithMinutes(summary.totals.totalLeaveHours)}</p>
            </div>
            <div>
              <span className="text-gray-600">Meeting Hours</span>
              <p className="font-medium text-gray-900">
                {summary.totals.totalMeetingHours.toFixed(2)}h
              </p>
              <p className="text-gray-500">{formatHoursWithMinutes(summary.totals.totalMeetingHours)}</p>
            </div>
            <div>
              <span className="text-gray-600">Available</span>
              <p className="font-medium text-blue-700">
                {getTotalCapacityValue()}{capacityUnit}
              </p>
              {!viewInPoints && (
                <p className="text-gray-500">{formatHoursWithMinutes(summary.totals.totalAvailableCapacity)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                Name
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                Base Hours
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                Leave Hours
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                Meeting Hours
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                Available Capacity
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.members.map((member, index) => (
              <tr
                key={member.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 text-sm">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                  <div>{member.baseHours.toFixed(2)}h</div>
                  <div className="text-xs text-gray-500">{formatHoursWithMinutes(member.baseHours)}</div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                  <div>{member.totalLeaveHours.toFixed(2)}h</div>
                  <div className="text-xs text-gray-500">{formatHoursWithMinutes(member.totalLeaveHours)}</div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                  <div>{member.totalMeetingHours.toFixed(2)}h</div>
                  <div className="text-xs text-gray-500">{formatHoursWithMinutes(member.totalMeetingHours)}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600 text-sm">
                  <div>{getCapacityValue(member)}{capacityUnit}</div>
                  {!viewInPoints && (
                    <div className="text-xs text-gray-500">{formatHoursWithMinutes(member.availableCapacity)}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200 font-bold">
              <td className="px-4 py-3 text-gray-900 text-sm">TOTAL</td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                <div>{summary.totals.baseHours.toFixed(2)}h</div>
                <div className="text-xs font-normal text-gray-600">{formatHoursWithMinutes(summary.totals.baseHours)}</div>
              </td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                <div>{summary.totals.totalLeaveHours.toFixed(2)}h</div>
                <div className="text-xs font-normal text-gray-600">{formatHoursWithMinutes(summary.totals.totalLeaveHours)}</div>
              </td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                <div>{summary.totals.totalMeetingHours.toFixed(2)}h</div>
                <div className="text-xs font-normal text-gray-600">{formatHoursWithMinutes(summary.totals.totalMeetingHours)}</div>
              </td>
              <td className="px-4 py-3 text-right text-blue-700 text-sm">
                <div>{getTotalCapacityValue()}{capacityUnit}</div>
                {!viewInPoints && (
                  <div className="text-xs font-normal text-gray-600">{formatHoursWithMinutes(summary.totals.totalAvailableCapacity)}</div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
