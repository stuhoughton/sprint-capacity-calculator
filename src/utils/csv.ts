import { TeamCapacitySummary } from '../types/index';

/**
 * Generates a CSV string from team capacity summary data
 * 
 * Format:
 * Team Member,Base Hours,Annual Leave Hours,Meeting Hours,Available Capacity
 * [member rows...]
 * TOTAL,[totals...]
 * 
 * @param summary - The team capacity summary to export
 * @returns CSV formatted string
 */
export function generateCSV(summary: TeamCapacitySummary): string {
  const headers = [
    'Team Member',
    'Base Hours',
    'Annual Leave Hours',
    'Meeting Hours',
    'Available Capacity',
  ];

  // Format member rows
  const memberRows = summary.members.map(member => [
    member.name,
    member.baseHours.toFixed(2),
    member.totalLeaveHours.toFixed(2),
    member.totalMeetingHours.toFixed(2),
    member.availableCapacity.toFixed(2),
  ]);

  // Add totals row
  const totalsRow = [
    'TOTAL',
    summary.totals.baseHours.toFixed(2),
    summary.totals.totalLeaveHours.toFixed(2),
    summary.totals.totalMeetingHours.toFixed(2),
    summary.totals.totalAvailableCapacity.toFixed(2),
  ];

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
