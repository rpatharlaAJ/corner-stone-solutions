import React from 'react';
import { ShieldCheck, ArrowUp, Inbox } from 'lucide-react';

interface FooterProps {
  onOpenScheduler: () => void;
  onOpenLeadPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenScheduler, onOpenLeadPortal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          <div className="flex items-center gap-3 text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold font-display text-sm">
              CS
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                Corner Stone Solutions
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Boutique Salesforce Consulting for SMBs
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
            <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
            <a href="#transformations" className="hover:text-slate-900 transition-colors">Transformations</a>
            <a href="#why-us" className="hover:text-slate-900 transition-colors">Why Corner Stone</a>
            <a href="#insights" className="hover:text-slate-900 transition-colors">Insights</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
            <button
              onClick={onOpenLeadPortal}
              className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Owner Inbox</span>
            </button>
          </div>

          <button
            onClick={onOpenScheduler}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
          >
            Schedule Call
          </button>

        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} Corner Stone Solutions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Certified Salesforce Application Architect</span>
            </div>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenLeadPortal}
              className="hover:text-slate-700 underline"
            >
              Inquiries & Bookings (Owner Portal)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-slate-700 inline-flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
