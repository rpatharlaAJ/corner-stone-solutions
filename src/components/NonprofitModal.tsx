import React from 'react';
import { X, ArrowRight, CheckCircle2, HeartHandshake, Sparkles, Layers, Award } from 'lucide-react';

interface NonprofitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNonprofitCall: (notes?: string) => void;
}

export const NonprofitModal: React.FC<NonprofitModalProps> = ({
  isOpen,
  onClose,
  onBookNonprofitCall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nonprofit-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-800 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300 mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Dedicated Nonprofit Practice</span>
            </div>
            <h2 id="nonprofit-modal-title" className="text-lg sm:text-xl font-display font-bold">
              Salesforce for Nonprofits: NPSP &amp; Nonprofit Cloud (NPC)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Manage donors, grants, fundraising campaigns, and program impact without enterprise consulting overhead.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close nonprofit guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Power of Us Callout */}
          <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 flex items-start gap-3 text-xs">
            <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 block">
                Salesforce Power of Us (P10) License Readiness
              </span>
              <p className="text-blue-900/90 mt-0.5 leading-relaxed">
                Eligible registered nonprofits qualify for up to <strong>10 donated Salesforce Enterprise Edition licenses</strong>. We help you select the right org template and architect your data model from day one so you never outgrow it.
              </p>
            </div>
          </div>

          {/* Side-by-Side NPSP vs NPC */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Which Nonprofit Platform Fits Your Organization?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-display font-bold text-slate-900">
                    Nonprofit Success Pack (NPSP)
                  </h4>
                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Proven Classic
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Ideal if you already run NPSP and need technical cleanup, Flow optimization, or AppExchange donor integrations.
                </p>
                <ul className="space-y-1.5 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Household Account model &amp; soft credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>General Accounting Units (GAUs) &amp; rollups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Legacy workflow-to-Flow modernization</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-blue-200 bg-white shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-display font-bold text-slate-900">
                    Nonprofit Cloud (NPC)
                  </h4>
                  <span className="text-[10px] font-mono font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Modern Core
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Salesforce’s next-generation native platform unifying Fundraising, Grantmaking, and Programs on Core.
                </p>
                <ul className="space-y-1.5 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Native Fundraising &amp; Gift Commitments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Unified Program, Case &amp; Outcome tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Clean NPSP-to-NPC migration roadmaps</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Core Nonprofit Deliverables */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              What We Configure in 3 to 5 Weeks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated donor thank-you &amp; tax-receipt Flows</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Grant deadline, budget &amp; reporting pipelines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Stripe, Classy &amp; QuickBooks reconciliation sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Executive board dashboards &amp; donor retention KPIs</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preferred Nonprofit Rate</span>
              </div>
              <p className="text-sm font-display font-bold mt-0.5">
                Ready to evaluate NPSP or Nonprofit Cloud for your team?
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNonprofitCall('Interested in Salesforce for our Nonprofit organization (NPSP / Nonprofit Cloud)');
              }}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors shadow-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>Book Nonprofit Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
