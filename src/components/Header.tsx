/**
 * Header component
 * Displays application title and description with N Brown branding
 * Requirements: 14.1, 14.2, 14.3, 14.4
 */
export function Header() {
  return (
    <header className="mb-8 md:mb-12 pb-6 md:pb-8 border-b-2 border-nbrown-100">
      <div className="flex items-start gap-4 md:gap-6 mb-4">
        {/* Title */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-nbrown-900 mb-2 md:mb-3">
            Sprint Capacity Calculator
          </h1>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 pt-1">
          <img 
            src="/images/logo.png" 
            alt="N Brown Logo" 
            className="h-12 md:h-14 w-auto"
          />
        </div>
      </div>
      
      <p className="text-gray-600 text-base md:text-lg">
        Calculate your team's available development capacity for sprint planning
      </p>
    </header>
  );
}
