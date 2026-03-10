import React from 'react';

/**
 * InfoSection - Combined reference information for users
 * Displays time conversion guide and standard working week info
 */
export const InfoSection: React.FC = () => {
  const conversions = [
    { minutes: 10, hours: 0.17 },
    { minutes: 15, hours: 0.25 },
    { minutes: 20, hours: 0.33 },
    { minutes: 30, hours: 0.5 },
    { minutes: 45, hours: 0.75 },
    { minutes: 60, hours: 1 },
    { minutes: 90, hours: 1.5 },
    { minutes: 120, hours: 2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Time Conversion Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Time Conversion Guide</h3>
        <div className="grid grid-cols-2 gap-2">
          {conversions.map((conversion) => (
            <div key={conversion.minutes} className="text-xs">
              <div className="font-medium text-blue-900">{conversion.minutes} min</div>
              <div className="text-blue-700">{conversion.hours} hrs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Working Week */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Standard Working Week</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <p>Monday - Thursday: 09:00 - 17:00</p>
          <p className="text-blue-700 font-medium">7.67 hours per day (after 40 min lunch)</p>
          <p className="pt-2">Friday: 09:00 - 16:30</p>
          <p className="text-blue-700 font-medium">7.08 hours per day (after 40 min lunch)</p>
          <p className="text-blue-700 font-medium pt-2">Total: 36.17 hours/week</p>
        </div>
      </div>
    </div>
  );
};
