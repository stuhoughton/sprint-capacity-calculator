import React from 'react';

export const TimeConversionGlossary: React.FC = () => {
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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">Time Conversion Guide</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {conversions.map((conversion) => (
          <div key={conversion.minutes} className="text-xs">
            <div className="font-medium text-blue-900">{conversion.minutes} min</div>
            <div className="text-blue-700">{conversion.hours} hrs</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TimeConversionGlossary;
