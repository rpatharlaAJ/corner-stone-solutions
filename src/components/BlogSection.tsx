import React, { useState } from 'react';
import { ArrowRight, X, CheckCircle2, BookOpen } from 'lucide-react';
import { INSIGHTS } from '../data/consultingData';

interface BlogSectionProps {
  onBookCall: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onBookCall }) => {
  const [activeArticle, setActiveArticle] = useState<typeof INSIGHTS[0] | null>(null);

  return (
    <section id="insights" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
            <span>Practical Advice</span>
            <span aria-hidden="true">·</span>
            <span>Industry Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight text-balance">
            Actionable Salesforce blueprints for growing small businesses.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Straightforward playbooks on pipeline discipline, automation best practices, and avoiding costly CRM mistakes.
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSIGHTS.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div>
                {/* Zero-Pill unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-blue-700">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="text-lg font-display font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticle(item)}
                  className="text-xs font-semibold text-slate-900 hover:text-blue-700 inline-flex items-center gap-1.5"
                >
                  <span>Read 4 Key Rules</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Reading Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-700">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-900 leading-snug">
                {activeArticle.title}
              </h2>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed italic border-b border-slate-100 pb-4">
                {activeArticle.summary}
              </p>

              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Key Architectural Takeaways:
                </h4>
                <ul className="space-y-3">
                  {activeArticle.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onBookCall();
                  }}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm inline-flex items-center gap-2"
                >
                  <span>Book Free Discovery Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
