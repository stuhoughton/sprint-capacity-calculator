import { ExportButton } from './ExportButton';
import { ClearButton } from './ClearButton';

/**
 * ActionBar component
 * Renders ExportButton and ClearButton
 * Provides layout and spacing
 * Requirements: 9.1, 16.1
 */
export function ActionBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
      <ExportButton />
      <ClearButton />
    </div>
  );
}
