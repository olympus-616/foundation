import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ConfidentialBanner from './ConfidentialBanner';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Close mobile nav on route change
  const handleNavigate = () => setMobileNavOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-warm-white font-sans" key={location.pathname}>
      <ConfidentialBanner />

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-light-gray">
        <span className="font-serif text-lg text-navy tracking-wide">OLYMPUS-GRID</span>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-navy"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-white border-b border-light-gray py-4">
          <Navigation onNavigate={handleNavigate} />
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white border-r border-light-gray">
          <div className="sticky top-0 pt-8 pb-8 overflow-y-auto max-h-screen">
            <div className="px-6 mb-8">
              <p className="font-serif text-xl text-navy tracking-wide">OLYMPUS-GRID</p>
              <p className="text-xs text-gold italic mt-0.5">Sovereign AI Infrastructure</p>
            </div>
            <Navigation />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[940px] mx-auto px-6 py-12">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
