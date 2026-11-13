import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FaqSectionProps {
  onOpenScheduler: () => void;
}

const FAQS = [
  {
    question: 'How long does a Salesforce QuickStart take for a small business?',
    answer:
      'Our Salesforce QuickStart for SMBs launches in 3 to 4 weeks on a fixed-price scope, including a standardized 5-stage sales pipeline, Gmail/Outlook sync, automated lead routing, executive dashboards, and hands-on team training.',
  },
  {
    question: 'How does Corner Stone Solutions price engagements?',
    answer:
      'We use transparent fixed-scope pricing for QuickStarts and CRM Health Audits, and predictable monthly retainers with rollover hours for Dedicated Admin & Flow Automation—with zero runaway hourly billing.',
  },
  {
    question: 'Do you support Nonprofits using NPSP or Nonprofit Cloud (NPC)?',
    answer:
      'Yes. We help mission-driven nonprofits manage donors, householding, recurring gifts, grants, and program outcomes—whether launching fresh on Salesforce Nonprofit Cloud (NPC), optimizing an existing Nonprofit Success Pack (NPSP) org, or transitioning cleanly from NPSP to NPC.',
  },
  {
    question: 'Can you migrate our team off spreadsheets or HubSpot into Salesforce?',
    answer:
      'Yes. We clean, deduplicate, and map your accounts, contacts, historical deals, and custom pricing tiers so your reps start with accurate data and zero re-keying.',
  },
  {
    question: 'Do you integrate Salesforce with QuickBooks, Stripe, or Slack?',
    answer:
      'Yes. We connect Salesforce directly to QuickBooks Online, Stripe, DocuSign, Slack, and custom REST APIs so closed deals automatically trigger invoicing, onboarding workflows, and real-time team alerts.',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenScheduler }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
            <span>Common Questions</span>
            <span aria-hidden="true">·</span>
            <span>Clear Answers</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight text-balance">
            Frequently asked questions from SMB leaders.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <h3 className="text-sm sm:text-base font-display font-bold text-slate-900">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-8">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onOpenScheduler}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 hover:text-blue-900"
          >
            <span>Have a specific architecture question? Book a free 30-min call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
