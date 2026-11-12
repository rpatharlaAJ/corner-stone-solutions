import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Clock, Zap } from 'lucide-react';
import { CERTIFICATIONS } from '../data/consultingData';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-slate-900 text-white py-10 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Guarantees for Small Business Owners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Fixed-Price Transparency</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Clear deliverables, guaranteed scopes, and zero surprise billable hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">30-Day Go-Live Momentum</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Working sandbox prototypes delivered weekly. No multi-month stalls.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Principal Architect Attention</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Your system is built directly by certified senior practitioners, never outsourced.
              </p>
            </div>
          </div>
        </div>

        {/* Certifications strip */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Award className="w-4 h-4" />
            <span>Salesforce Certified Standards:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {CERTIFICATIONS.map((cert, i) => (
              <React.Fragment key={cert}>
                <span className="font-medium text-slate-200">{cert}</span>
                {i < CERTIFICATIONS.length - 1 && (
                  <span aria-hidden="true" className="text-slate-600">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
