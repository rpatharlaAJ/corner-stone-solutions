import React, { useState } from 'react';
import { ArrowRight, Mail, MapPin, CheckCircle2, ShieldCheck, Clock, Send } from 'lucide-react';

interface ContactSectionProps {
  onOpenScheduler: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenScheduler }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact_inquiry',
          name,
          email,
          company,
          message,
          source: 'contact_form',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send inquiry.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Unable to submit your inquiry right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Outreach */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>Get In Touch</span>
              <span aria-hidden="true">·</span>
              <span>Direct Architect Access</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight text-balance">
              Let’s discuss your Salesforce roadmap.
            </h2>

            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Whether you are planning your initial Sales Cloud QuickStart, auditing technical debt, or need ongoing admin support, we provide clear answers without sales pressure.
            </p>

            {/* Quick Scheduler CTA Box */}
            <div className="mt-8 p-6 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                Fastest Path
              </span>
              <h3 className="text-base font-display font-bold text-white">
                Book a 30-Minute Discovery Session
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Pick a business day directly on our calendar. We will review your current tools and share a realistic roadmap.
              </p>

              <button
                onClick={onOpenScheduler}
                className="mt-5 w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Open Live Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Details */}
            <div className="mt-8 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>advisory@cornerstonesolutions.crm</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NDA & Confidentiality Protected</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Send a Direct Project Inquiry
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Receive a response from our lead architect within 4 business hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you, {name}. A principal architect will review your note and email you at <strong className="text-slate-900">{email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 text-xs font-semibold text-blue-700 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Miller"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Miller Distribution Inc."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    What can we help you solve? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your team size, current setup (spreadsheets, HubSpot, Sales Cloud, NPSP, or Nonprofit Cloud), and primary goals..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 font-medium">
                    {submitError}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    No spam. Confidential.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
