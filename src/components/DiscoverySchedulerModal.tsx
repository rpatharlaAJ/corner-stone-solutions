import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Calendar, Clock, Download, ShieldCheck } from 'lucide-react';
import { CORE_SERVICES } from '../data/consultingData';

interface DiscoverySchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialNotes?: string;
}

export const DiscoverySchedulerModal: React.FC<DiscoverySchedulerModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialNotes,
}) => {
  const [selectedService, setSelectedService] = useState(initialService || CORE_SERVICES[0].title);
  const [selectedDate, setSelectedDate] = useState('2026-11-12');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState(initialNotes || '');
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Wed, Nov 11', value: '2026-11-11' },
    { label: 'Thu, Nov 12', value: '2026-11-12' },
    { label: 'Fri, Nov 13', value: '2026-11-13' },
    { label: 'Mon, Nov 16', value: '2026-11-16' },
    { label: 'Tue, Nov 17', value: '2026-11-17' },
  ];

  const slots = ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'discovery_booking',
          name,
          email,
          company,
          serviceFocus: selectedService,
          date: selectedDate,
          timeSlot: selectedTime,
          timezone: 'Eastern Time (US & Canada)',
          message: notes,
          source: 'website_scheduler',
        }),
      });
    } catch (err) {
      console.warn('Could not save booking to backend:', err);
    } finally {
      setIsSubmitting(false);
      setIsBooked(true);
    }
  };

  const handleDownloadIcs = () => {
    const calendarData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Corner Stone Solutions//Salesforce Discovery Session//EN
BEGIN:VEVENT
SUMMARY:Salesforce Discovery Call with Corner Stone Solutions
DESCRIPTION:30-minute discovery call for ${company}. Service: ${selectedService}.
DTSTART:20261112T160000Z
DTEND:20261112T163000Z
LOCATION:Google Meet (Link will be emailed to ${email})
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'cornerstone-discovery-call.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-sched-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 id="modal-sched-title" className="text-base font-display font-bold text-slate-900">
              Schedule Free 30-Min Discovery Session
            </h2>
            <p className="text-[11px] text-slate-500">
              Direct conversation with a Certified Application Architect
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700"
            aria-label="Close scheduler"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900">
              You're on the Calendar!
            </h3>
            
            <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We have reserved <strong>{selectedDate} at {selectedTime}</strong> for <strong>{name}</strong> ({company}). A calendar invitation has been sent to <strong>{email}</strong>.
            </p>

            <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Service Focus:</span>
                <span className="font-semibold text-slate-900">{selectedService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Meeting Format:</span>
                <span className="font-semibold text-slate-900">Google Meet Video</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Host:</span>
                <span className="font-semibold text-slate-900">Lead Certified Architect</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownloadIcs}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md inline-flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Save to Calendar (.ics)</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Service Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                Select Service Focus
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {CORE_SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>{s.title} ({s.timeline})</option>
                ))}
                <option value="General Architecture Question">General Architecture Question</option>
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                Select Business Date
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`py-2 px-1 rounded border text-center text-xs transition-all ${
                      selectedDate === d.value
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-[10px]">{d.label.split(',')[0]}</span>
                    <span className="block font-mono font-semibold">{d.label.split(',')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1">
                Select Time Slot (EST)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedTime(s)}
                    className={`py-1.5 rounded border text-center text-[11px] font-mono transition-all ${
                      selectedTime === s
                        ? 'bg-blue-700 text-white border-blue-700 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
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
                  placeholder="rachel@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Industrial Supplies"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                What is your biggest current CRM bottleneck? (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Quoting in spreadsheets, need custom flow, migrating to Sales Cloud"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm 30-Min Discovery Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                100% Free · No sales pitch · Concrete architectural advice
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
