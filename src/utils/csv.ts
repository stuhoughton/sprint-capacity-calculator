import { TeamCapacitySummary, StoryPointScale } from '../types/index';
import { convertHoursToTotalStoryPoints, convertHoursToHoursAndMinutes } from './storyPoints';

/**
 * Generates a CSV string from team capacity summary data
 * 
 * Format:
 * Team Member,Base Hours,Base Hours (h:m),Annual Leave Hours,Annual Leave Hours (h:m),Meeting Hours,Meeting Hours (h:m),Available Capacity (Hours),Available Capacity (h:m),Available Capacity (Story Points)
 * [member rows...]
 * TOTAL,[totals...]
 * 
 * @param summary - The team capacity summary to export
 * @param storyPointScale - The story point scale for conversion
 * @returns CSV formatted string
 */
export function generateCSV(summary: TeamCapacitySummary, storyPointScale?: StoryPointScale): string {
  const headers = [
    'Team Member',
    'Base Hours',
    'Base Hours (h:m)',
    'Annual Leave Hours',
    'Annual Leave Hours (h:m)',
    'Meeting Hours',
    'Meeting Hours (h:m)',
    'Available Capacity (Hours)',
    'Available Capacity (h:m)',
  ];

  // Add story points column if scale is provided
  if (storyPointScale) {
    headers.push('Available Capacity (Story Points)');
  }

  // Format member rows
  const memberRows = summary.members.map(member => {
    const { hours: baseH, minutes: baseM } = convertHoursToHoursAndMinutes(member.baseHours);
    const { hours: leaveH, minutes: leaveM } = convertHoursToHoursAndMinutes(member.totalLeaveHours);
    const { hours: meetH, minutes: meetM } = convertHoursToHoursAndMinutes(member.totalMeetingHours);
    const { hours: availH, minutes: availM } = convertHoursToHoursAndMinutes(member.availableCapacity);

    const row = [
      member.name,
      member.baseHours.toFixed(2),
      `${baseH}h ${baseM}m`,
      member.totalLeaveHours.toFixed(2),
      `${leaveH}h ${leaveM}m`,
      member.totalMeetingHours.toFixed(2),
      `${meetH}h ${meetM}m`,
      member.availableCapacity.toFixed(2),
      `${availH}h ${availM}m`,
    ];

    // Add story points if scale is provided
    if (storyPointScale) {
      const storyPoints = Math.floor(convertHoursToTotalStoryPoints(member.availableCapacity, storyPointScale));
      row.push(storyPoints.toString());
    }

    return row;
  });

  // Add totals row
  const { hours: totalBaseH, minutes: totalBaseM } = convertHoursToHoursAndMinutes(summary.totals.baseHours);
  const { hours: totalLeaveH, minutes: totalLeaveM } = convertHoursToHoursAndMinutes(summary.totals.totalLeaveHours);
  const { hours: totalMeetH, minutes: totalMeetM } = convertHoursToHoursAndMinutes(summary.totals.totalMeetingHours);
  const { hours: totalAvailH, minutes: totalAvailM } = convertHoursToHoursAndMinutes(summary.totals.totalAvailableCapacity);

  const totalsRow = [
    'TOTAL',
    summary.totals.baseHours.toFixed(2),
    `${totalBaseH}h ${totalBaseM}m`,
    summary.totals.totalLeaveHours.toFixed(2),
    `${totalLeaveH}h ${totalLeaveM}m`,
    summary.totals.totalMeetingHours.toFixed(2),
    `${totalMeetH}h ${totalMeetM}m`,
    summary.totals.totalAvailableCapacity.toFixed(2),
    `${totalAvailH}h ${totalAvailM}m`,
  ];

  // Add story points total if scale is provided
  if (storyPointScale) {
    const totalStoryPoints = Math.floor(convertHoursToTotalStoryPoints(summary.totals.totalAvailableCapacity, storyPointScale));
    totalsRow.push(totalStoryPoints.toString());
  }

  // Combine headers, member rows, and totals row
  const allRows = [
    headers,
    ...memberRows,
    totalsRow,
  ];

  // Join rows with newlines, and columns with commas
  const csv = allRows.map(row => row.join(',')).join('\n');

  return csv;
}

/**
 * Triggers a browser download of CSV data
 * 
 * Creates a blob from the CSV string, generates a download link,
 * and triggers the browser's download mechanism.
 * 
 * @param csv - The CSV formatted string to download
 */
export function downloadCSV(csv: string): void {
  // Generate timestamp in YYYY-MM-DD format
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `sprint-capacity-${timestamp}.csv`;

  // Create blob from CSV string
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  // Create temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  URL.revokeObjectURL(url);
}
