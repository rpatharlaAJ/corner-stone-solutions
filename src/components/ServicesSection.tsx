import React from 'react';
import { ArrowRight, Check, Clock, ShieldCheck } from 'lucide-react';
import { CORE_SERVICES } from '../data/consultingData';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
            <span>What We Do</span>
            <span aria-hidden="true">·</span>
            <span>Core Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight text-balance">
            Four focused ways we help businesses and nonprofits scale on Salesforce.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            No endless menu of confusing enterprise add-ons. We focus on the core solutions that eliminate operational friction across SMBs and nonprofits using Sales Cloud, NPSP, or Nonprofit Cloud (NPC).
          </p>
        </div>

        {/* 4 Core Solution Cards (Clean 2x2 Grid) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {CORE_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-7 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="w-8 h-8 rounded bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {service.number}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-700 block">
                      {service.timeline}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {service.pricing}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-display font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-blue-700">
                  {service.tagline}
                </p>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Highlights */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                    Guaranteed In Scope:
                  </span>
                  <ul className="space-y-2.5">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-5 border-t border-slate-100">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>{service.ctaLabel}</span>
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
