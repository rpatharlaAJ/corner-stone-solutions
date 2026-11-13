import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/consultingData';

interface HeroProps {
  onOpenScheduler: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenScheduler, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Launch Banner (Quiet, unboxed text kicker) */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Launching 2026</span>
          <span aria-hidden="true">·</span>
          <span>Boutique Salesforce Consulting for SMBs &amp; Nonprofits</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Clear Value Prop */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-slate-900 leading-[1.18] text-balance">
              Build your Salesforce foundation right from day one.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Corner Stone Solutions helps small businesses and nonprofits eliminate spreadsheet chaos, manage operations across Sales Cloud, NPSP, or Nonprofit Cloud (NPC), and launch reliable Salesforce systems without enterprise bloat.
            </p>

            {/* Scannable Commitments */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fixed-scope 3 to 4 week launches</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certified Application Architect led</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero runaway hourly billing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Now booking Founding Clients</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenScheduler}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm inline-flex items-center gap-2.5"
              >
                <span>Schedule Free Discovery Call</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <span>View Core Services</span>
              </button>
            </div>

            {/* Trust endorsement */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>100% Certified Salesforce Platform App Builder & Application Architect</span>
            </div>
          </div>

          {/* Right Column: Clean Photographic Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
              <img
                src={HERO_IMAGE}
                alt="Corner Stone Solutions strategy session"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                    Boutique Advisory Model
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Direct access to your dedicated lead architect from initial blueprint to live launch.
                  </p>
                </div>
              </div>
            </div>

            {/* Founding Client Banner */}
            <div className="mt-3 p-3.5 rounded-lg bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-semibold">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Founding Client Launch Cohort</span>
              </div>
              <span className="text-blue-800 font-mono text-[11px]">Direct Founder Access</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
