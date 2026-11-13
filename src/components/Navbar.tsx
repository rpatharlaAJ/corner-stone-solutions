import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenScheduler: () => void;
  onOpenNonprofitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScheduler, onOpenNonprofitModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Transformations', href: '#transformations' },
    { label: 'Why Corner Stone', href: '#why-us' },
    { label: 'Insights', href: '#insights' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single Wordmark */}
          <a href="#" className="flex items-center gap-3 text-slate-900 whitespace-nowrap shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold font-display text-lg shadow-sm group-hover:bg-blue-900 transition-colors">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 leading-none">
                Corner Stone
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500 mt-1">
                Salesforce Solutions
              </span>
            </div>
          </a>

          {/* Zone 2: Clean single-line links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-slate-900"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenNonprofitModal}
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-blue-700"
            >
              Nonprofits (NPSP/NPC)
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenScheduler}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <span>Book Discovery Call</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-lg">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-800 hover:text-slate-900 py-1"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNonprofitModal();
              }}
              className="text-left text-base font-semibold text-blue-700 hover:text-blue-900 py-1"
            >
              Nonprofits (NPSP &amp; NPC)
            </button>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScheduler();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 rounded-md hover:bg-slate-800"
              >
                <span>Book Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
