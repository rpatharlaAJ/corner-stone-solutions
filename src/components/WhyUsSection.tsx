import React from 'react';
import { ArrowRight, Check, X, ShieldCheck } from 'lucide-react';

interface WhyUsSectionProps {
  onOpenScheduler: () => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ onOpenScheduler }) => {
  const comparison = [
    {
      feature: 'Who Actually Builds Your System',
      cornerstone: 'Dedicated Certified Application Architect with direct founder involvement',
      bigAgency: 'Senior partner pitches you, then hands your build to junior offshore contractors',
    },
    {
      feature: 'Pricing & Budget Predictability',
      cornerstone: 'Clear, transparent fixed-fee milestones with guaranteed deliverables',
      bigAgency: 'Open-ended hourly retainers with frequent scope creep and budget overruns',
    },
    {
      feature: 'Speed to Working Production',
      cornerstone: '3 to 4 weeks with weekly live sandbox demos',
      bigAgency: '4 to 6 months of bloated slide decks before you ever see working software',
    },
    {
      feature: 'Architecture Philosophy',
      cornerstone: 'Lean, low-maintenance Flows built for small team adoption',
      bigAgency: 'Enterprise over-engineering with 80 custom fields reps never use',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
            <span>The Boutique Advantage</span>
            <span aria-hidden="true">·</span>
            <span>Why Corner Stone</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight text-balance">
            Why small business owners choose a boutique partner over giant agencies.
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            We don’t believe in six-month delays or billing you for learning curves. We deliver working systems quickly, affordably, and with personal accountability.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-4 pr-6 font-semibold uppercase tracking-wider text-slate-400 w-1/4">
                  Factor
                </th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider text-blue-400 bg-slate-800/80 rounded-t-lg w-3/8">
                  Corner Stone Solutions (Boutique)
                </th>
                <th className="py-4 pl-6 font-semibold uppercase tracking-wider text-slate-500 w-3/8">
                  Traditional Enterprise Agencies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pr-6 font-bold text-slate-200">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 bg-slate-800/50 text-white font-medium">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{row.cornerstone}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-6 text-slate-400">
                    <div className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-rose-400/80 shrink-0 mt-0.5" />
                      <span>{row.bigAgency}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 p-6 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-display font-bold text-white">
              Want to see what an optimized Salesforce org looks like for your business?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Book a free 30-minute discovery session with our principal architect.
            </p>
          </div>

          <button
            onClick={onOpenScheduler}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors shadow-sm whitespace-nowrap inline-flex items-center gap-2"
          >
            <span>Schedule Discovery Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
