/**
 * Footer component
 * Displays version and info
 * Requirements: 14.1, 14.2
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 md:mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
      <p className="font-medium">Sprint Capacity Calculator v1.0.0</p>
      <p className="mt-2">© {currentYear} Nbrown SEO Team. All rights reserved.</p>
    </footer>
  );
}
