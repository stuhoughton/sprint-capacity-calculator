import React from 'react';
import { TeamCapacitySummary } from '../types';

interface CapacityTableProps {
  summary: TeamCapacitySummary;
  viewInPoints?: boolean;
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
}) => {
  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const getCapacityValue = (member: typeof summary.members[0]) => {
    if (viewInPoints && member.availableCapacityInPoints !== undefined) {
      return member.availableCapacityInPoints.toString();
    }
    return formatValue(member.availableCapacity);
  };

  const getTotalCapacityValue = () => {
    if (
      viewInPoints &&
      summary.totals.totalAvailableCapacityInPoints !== undefined
    ) {
      return summary.totals.totalAvailableCapacityInPoints.toString();
    }
    return formatValue(summary.totals.totalAvailableCapacity);
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
              <span className="text-lg font-bold text-blue-600">
                {getCapacityValue(member)}{capacityUnit}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600">Base Hours</span>
                <p className="font-medium text-gray-900">
                  {formatValue(member.baseHours)}h
                </p>
              </div>
              <div>
                <span className="text-gray-600">Leave Hours</span>
                <p className="font-medium text-gray-900">
                  {formatValue(member.totalLeaveHours)}h
                </p>
              </div>
              <div>
                <span className="text-gray-600">Meeting Hours</span>
                <p className="font-medium text-gray-900">
                  {formatValue(member.totalMeetingHours)}h
                </p>
              </div>
              <div>
                <span className="text-gray-600">Available</span>
                <p className="font-medium text-blue-600">
                  {getCapacityValue(member)}{capacityUnit}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Totals Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-900 text-sm">TOTAL</h3>
            <span className="text-lg font-bold text-blue-700">
              {getTotalCapacityValue()}{capacityUnit}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600">Base Hours</span>
              <p className="font-medium text-gray-900">
                {formatValue(summary.totals.baseHours)}h
              </p>
            </div>
            <div>
              <span className="text-gray-600">Leave Hours</span>
              <p className="font-medium text-gray-900">
                {formatValue(summary.totals.totalLeaveHours)}h
              </p>
            </div>
            <div>
              <span className="text-gray-600">Meeting Hours</span>
              <p className="font-medium text-gray-900">
                {formatValue(summary.totals.totalMeetingHours)}h
              </p>
            </div>
            <div>
              <span className="text-gray-600">Available</span>
              <p className="font-medium text-blue-700">
                {getTotalCapacityValue()}{capacityUnit}
              </p>
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
                  {formatValue(member.baseHours)}h
                </td>
                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                  {formatValue(member.totalLeaveHours)}h
                </td>
                <td className="px-4 py-3 text-right text-gray-700 text-sm">
                  {formatValue(member.totalMeetingHours)}h
                </td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600 text-sm">
                  {getCapacityValue(member)}{capacityUnit}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200 font-bold">
              <td className="px-4 py-3 text-gray-900 text-sm">TOTAL</td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                {formatValue(summary.totals.baseHours)}h
              </td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                {formatValue(summary.totals.totalLeaveHours)}h
              </td>
              <td className="px-4 py-3 text-right text-gray-900 text-sm">
                {formatValue(summary.totals.totalMeetingHours)}h
              </td>
              <td className="px-4 py-3 text-right text-blue-700 text-sm">
                {getTotalCapacityValue()}{capacityUnit}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
