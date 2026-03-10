/**
 * Header component
 * Displays application title and description
 * Requirements: 14.1, 14.2, 14.3, 14.4
 */
export function Header() {
  return (
    <header className="mb-8 md:mb-12">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
        Sprint Capacity Calculator
      </h1>
      <p className="text-gray-600 text-base md:text-lg">
        Calculate your team's available development capacity for sprint planning
      </p>
    </header>
  );
}
