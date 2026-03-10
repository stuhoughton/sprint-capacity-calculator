import { TeamInputSection } from './TeamInputSection';
import { CapacitySummarySection } from './CapacitySummarySection';
import { ConfigurationSection } from './ConfigurationSection';
import { ActionBar } from './ActionBar';
import { InfoSection } from './InfoSection';

/**
 * MainContainer component
 * Arranges TeamInputSection, CapacitySummarySection, ConfigurationSection, ActionBar
 * Implements responsive grid layout (mobile-first)
 * Requirements: 12.1, 12.4, 12.5, 14.1, 14.2
 */
export function MainContainer() {
  return (
    <main className="space-y-6 md:space-y-8">
      {/* Mobile-first: single column layout */}
      {/* Tablet: two column layout */}
      {/* Desktop: two column layout (wider sections) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Team Input Section - Left column */}
        <div className="md:col-span-1">
          <TeamInputSection />
        </div>

        {/* Capacity Summary Section - Right column */}
        <div className="md:col-span-1">
          <CapacitySummarySection />
        </div>
      </div>

      {/* Info Section - After capacity summary for context */}
      <InfoSection />

      {/* Configuration Section - Full width */}
      <div>
        <ConfigurationSection />
      </div>

      {/* Action Bar - Full width at bottom */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
        <ActionBar />
      </div>
    </main>
  );
}
