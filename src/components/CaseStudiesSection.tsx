import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { TRANSFORMATIONS } from '../data/consultingData';

interface CaseStudiesSectionProps {
  onBookCall: (context: string) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onBookCall }) => {
  return (
    <section id="transformations" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
            <span>Proven Impact</span>
            <span aria-hidden="true">·</span>
            <span>Real Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight text-balance">
            What happens when small businesses get their CRM foundation right.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See the exact operational before-and-after transformations we deliver for small and mid-sized teams.
          </p>
        </div>

        {/* 3 Transformation Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRANSFORMATIONS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Visual */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium">
                    {item.industry}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-700/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-bold font-mono">
                    {item.metric}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-display font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* Before vs After comparison */}
                  <div className="mt-5 space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-950">
                      <span className="font-bold block text-rose-800 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>The Pain Point Before:</span>
                      </span>
                      <p className="leading-relaxed text-rose-900/90">{item.before}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                      <span className="font-bold block text-emerald-800 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>The Corner Stone Transformation:</span>
                      </span>
                      <p className="leading-relaxed text-emerald-900/90">{item.after}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => onBookCall(`Discuss similar transformation: ${item.title}`)}
                  className="w-full text-xs font-semibold text-slate-900 hover:text-blue-700 inline-flex items-center justify-between"
                >
                  <span>Explore Similar Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
