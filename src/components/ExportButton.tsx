import { useAppContext } from '../context/AppContext';
import { calculateTeamCapacitySummary } from '../utils/calculations';
import { generateCSV, downloadCSV } from '../utils/csv';

/**
 * ExportButton component
 * Displays export to CSV button
 * Calls generateCSV and downloadCSV on click
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export function ExportButton() {
  const { state } = useAppContext();

  const handleExport = () => {
    try {
      const summary = calculateTeamCapacitySummary(state.teamMembers, state.config.baseHours);
      const csv = generateCSV(summary, state.config.storyPointScale);
      downloadCSV(csv);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="w-full sm:w-auto px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm md:text-base min-h-[44px] md:min-h-auto flex items-center justify-center"
      title="Export team capacity data as CSV"
    >
      Export to CSV
    </button>
  );
}
