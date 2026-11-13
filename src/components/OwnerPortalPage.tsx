import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Mail,
  Phone,
  Building,
  Search,
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  FileText,
  ExternalLink,
  Lock,
  KeyRound,
  Send,
  Copy,
  Check,
  ArrowLeft,
  Radio,
  Share2,
  X,
} from 'lucide-react';

export interface OutreachEntry {
  id: string;
  sentAt: string;
  channel: string;
  subject: string;
  summary?: string;
}

export interface LeadItem {
  id: string;
  type: 'discovery_booking' | 'contact_inquiry';
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  serviceFocus?: string;
  date?: string;
  timeSlot?: string;
  timezone?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Call Completed' | 'Proposal Sent' | 'Archived';
  source: string;
  notes?: string;
  lastContactedAt?: string;
  outreachHistory?: OutreachEntry[];
}

export const OwnerPortalPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'discovery_booking' | 'contact_inquiry'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Contact / Send Prospect Modal State
  const [activeProspect, setActiveProspect] = useState<LeadItem | null>(null);
  const [modalMode, setModalMode] = useState<'contact' | 'forward'>('contact');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('cs_crm_webhook_url') || '');
  const [forwardNote, setForwardNote] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security Passcode Protection Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cs_owner_auth') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const OWNER_PASSCODE = '2026';

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLeads();
    const interval = setInterval(fetchLeads, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchLeads]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === OWNER_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cs_owner_auth', 'true');
      setPasscodeError(false);
      setPasscodeInput('');
    } else {
      setPasscodeError(true);
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cs_owner_auth');
  };

  const handleUpdateStatus = async (id: string, status: LeadItem['status']) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesInput }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: notesInput } : l)));
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to remove this prospect record?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const openContactModal = (lead: LeadItem) => {
    const slotNote =
      lead.type === 'discovery_booking' && lead.date
        ? `looking forward to our discovery call on ${lead.date} at ${lead.timeSlot} (${lead.timezone || 'EST'})`
        : 'thank you for reaching out to Corner Stone Solutions';

    setActiveProspect(lead);
    setModalMode('contact');
    setEmailSubject(`Corner Stone Solutions — ${lead.serviceFocus || 'Salesforce Discovery'} (${lead.company})`);
    setEmailBody(
      `Hi ${lead.name.split(' ')[0]},\n\nI'm ${slotNote} regarding ${lead.company}'s ${lead.serviceFocus || 'Salesforce setup'}.\n\nI reviewed your note${lead.message ? ` ("${lead.message}")` : ''} and would love to walk through practical next steps.\n\nBest regards,\nCorner Stone Solutions\nCertified Salesforce Application Architect`
    );
    setActionFeedback(null);
  };

  const openForwardModal = (lead: LeadItem) => {
    setActiveProspect(lead);
    setModalMode('forward');
    setForwardNote(lead.notes || '');
    setActionFeedback(null);
  };

  const buildProspectBrief = (lead: LeadItem) => {
    return [
      `PROSPECT BRIEF — Corner Stone Solutions`,
      `Name: ${lead.name}`,
      `Company: ${lead.company}`,
      `Email: ${lead.email}`,
      lead.phone ? `Phone: ${lead.phone}` : null,
      `Type: ${lead.type === 'discovery_booking' ? 'Discovery Call Booking' : 'Contact Form Inquiry'}`,
      `Service Focus: ${lead.serviceFocus || 'General Salesforce Solutions'}`,
      lead.date ? `Scheduled: ${lead.date} at ${lead.timeSlot} (${lead.timezone || 'EST'})` : null,
      `Status: ${lead.status}`,
      lead.message ? `Client Note: ${lead.message}` : null,
      lead.notes ? `Internal Notes: ${lead.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleCopyBrief = async (lead: LeadItem) => {
    try {
      await navigator.clipboard.writeText(buildProspectBrief(lead));
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSendOutreach = async (openMailClient: boolean) => {
    if (!activeProspect) return;
    setActionBusy(true);
    setActionFeedback(null);

    if (openMailClient) {
      const mailtoHref = `mailto:${encodeURIComponent(activeProspect.email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoHref;
    }

    try {
      const res = await fetch(`/api/leads/${activeProspect.id}/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'email',
          subject: emailSubject,
          summary: emailBody.slice(0, 180),
          nextStatus: activeProspect.status === 'New' ? 'Contacted' : activeProspect.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log outreach');
      setLeads((prev) => prev.map((l) => (l.id === activeProspect.id ? data.lead : l)));
      setActionFeedback({
        type: 'success',
        text: openMailClient
          ? 'Email client opened and prospect marked as Contacted.'
          : 'Outreach logged and prospect marked as Contacted.',
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', text: err?.message || 'Failed to record outreach.' });
    } finally {
      setActionBusy(false);
    }
  };

  const handleDispatchWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProspect || !webhookUrl.trim()) return;
    setActionBusy(true);
    setActionFeedback(null);
    localStorage.setItem('cs_crm_webhook_url', webhookUrl.trim());

    try {
      const res = await fetch(`/api/leads/${activeProspect.id}/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'webhook',
          subject: `Prospect dispatched to ${new URL(webhookUrl.trim()).hostname}`,
          summary: forwardNote,
          webhookUrl: webhookUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Webhook delivery failed');
      setLeads((prev) => prev.map((l) => (l.id === activeProspect.id ? data.lead : l)));
      setActionFeedback({ type: 'success', text: 'Prospect payload sent to external endpoint successfully.' });
    } catch (err: any) {
      setActionFeedback({ type: 'error', text: err?.message || 'Failed to send prospect to webhook.' });
    } finally {
      setActionBusy(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID', 'Type', 'Date Submitted', 'Name', 'Company', 'Email',
      'Phone', 'Service Focus', 'Scheduled Date', 'Scheduled Slot',
      'Status', 'Client Message', 'Internal Notes',
    ];

    const rows = leads.map((l) => [
      l.id,
      l.type === 'discovery_booking' ? 'Discovery Call' : 'Contact Inquiry',
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      l.email,
      l.phone || '',
      `"${(l.serviceFocus || '').replace(/"/g, '""')}"`,
      l.date || '',
      l.timeSlot || '',
      l.status,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cornerstone-prospects-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.serviceFocus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const bookedCallsCount = leads.filter((l) => l.type === 'discovery_booking').length;
  const inquiriesCount = leads.filter((l) => l.type === 'contact_inquiry').length;
  const newCount = leads.filter((l) => l.status === 'New').length;

  // Separate Full-Page Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-7 sm:p-9">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm font-display">
                CS
              </div>
              <div>
                <span className="font-display font-bold text-sm text-slate-900 block leading-tight">
                  Corner Stone Solutions
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Owner Prospect Portal
                </span>
              </div>
            </div>
            <a
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>
          </div>

          <div className="text-center py-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-display font-bold text-slate-900">
              Owner Portal Sign-In
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Separate private workspace receiving prospects, booked calls, and inquiries sent from the public site.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Owner Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Enter PIN (default: 2026)"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono tracking-widest"
                />
              </div>
              {passcodeError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  Incorrect passcode. Default setup passkey is 2026.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Open Owner Inbox</span>
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Setup PIN: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">2026</code>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Workspace Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs font-display shadow-inner shrink-0">
              CS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-display font-bold leading-tight">
                  Owner Prospect Portal
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>Connected to Public Page</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Receiving bookings &amp; inquiries from <span className="text-slate-300 font-mono">/</span>
                {lastSyncedAt ? ` · Synced ${lastSyncedAt}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              disabled={isLoading}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh incoming prospects"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Export CSV</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
            >
              <span>Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleLock}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Lock portal"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-slate-500 block text-xs">Total Prospects</span>
            <span className="font-mono text-2xl font-bold text-slate-900 mt-1 block">{leads.length}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-slate-500 block text-xs">Booked Discovery Calls</span>
            <span className="font-mono text-2xl font-bold text-blue-700 mt-1 block">{bookedCallsCount}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-slate-500 block text-xs">Contact Form Inquiries</span>
            <span className="font-mono text-2xl font-bold text-slate-800 mt-1 block">{inquiriesCount}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-slate-500 block text-xs">Awaiting First Contact</span>
            <span className="font-mono text-2xl font-bold text-amber-600 mt-1 block">{newCount}</span>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setFilterType('discovery_booking')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterType === 'discovery_booking' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Booked Calls ({bookedCallsCount})
            </button>
            <button
              onClick={() => setFilterType('contact_inquiry')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterType === 'contact_inquiry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inquiries ({inquiriesCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="New">Status: New</option>
              <option value="Contacted">Status: Contacted</option>
              <option value="Call Completed">Status: Call Completed</option>
              <option value="Proposal Sent">Status: Proposal Sent</option>
              <option value="Archived">Status: Archived</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prospects..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-44 sm:w-64"
              />
            </div>
          </div>
        </section>

        {/* Prospects List */}
        <section className="space-y-4">
          {filteredLeads.map((lead) => {
            const isBooking = lead.type === 'discovery_booking';
            const isEditingNotes = editingNotesId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 hover:border-slate-300 transition-all shadow-xs"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        isBooking
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {isBooking ? 'Booked Discovery Session' : 'Contact Form Inquiry'}
                    </span>

                    <span className="text-slate-400 text-[11px]">
                      Received {new Date(lead.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {lead.lastContactedAt && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        · Last contacted {new Date(lead.lastContactedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openContactModal(lead)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Contact Prospect</span>
                    </button>

                    <button
                      onClick={() => openForwardModal(lead)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      title="Send or forward prospect brief"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Send Prospect</span>
                    </button>

                    <button
                      onClick={() => handleCopyBrief(lead)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md"
                      title="Copy prospect brief"
                    >
                      {copiedId === lead.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadItem['status'])}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border focus:outline-none ${
                        lead.status === 'New'
                          ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold'
                          : lead.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : lead.status === 'Call Completed'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="New">● New</option>
                      <option value="Contacted">● Contacted</option>
                      <option value="Call Completed">● Call Completed</option>
                      <option value="Proposal Sent">● Proposal Sent</option>
                      <option value="Archived">● Archived</option>
                    </select>

                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Client Info Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 space-y-2 text-xs">
                    <div>
                      <h2 className="text-base font-display font-bold text-slate-900">{lead.name}</h2>
                      <div className="flex items-center gap-1.5 text-slate-600 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{lead.company}</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="text-blue-700 hover:underline">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {isBooking && lead.date && (
                      <div className="mt-3 p-3 bg-blue-50/80 rounded-lg border border-blue-200/80 text-blue-950">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>Reserved Discovery Slot:</span>
                        </div>
                        <p className="font-mono text-xs font-semibold text-blue-900">
                          {lead.date} at {lead.timeSlot}
                        </p>
                        <span className="text-[11px] text-blue-700 block mt-0.5">
                          {lead.timezone} · Google Meet
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Service Focus: {lead.serviceFocus}
                        </span>
                        <span className="text-[11px] text-slate-400">Source: {lead.source}</span>
                      </div>

                      {lead.message ? (
                        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900 block mb-0.5">Client Note / Bottleneck:</span>
                          {lead.message}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No additional notes provided by prospect.</p>
                      )}
                    </div>

                    {/* Internal Notes */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      {isEditingNotes ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Write private notes on this prospect, budget, or next step..."
                            className="w-full p-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(lead.id)}
                              className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px]">
                              {lead.notes ? (
                                <strong className="text-slate-800">Note: {lead.notes}</strong>
                              ) : (
                                <span className="text-slate-400 italic">No internal notes</span>
                              )}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingNotesId(lead.id);
                              setNotesInput(lead.notes || '');
                            }}
                            className="text-[11px] font-semibold text-blue-700 hover:underline shrink-0"
                          >
                            {lead.notes ? 'Edit' : '+ Add Note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLeads.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No prospects found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No results matching "${searchQuery}".`
                  : 'Prospects submitted via the public Contact Form, Discovery Scheduler, or Chatbot appear here automatically.'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Separate Owner Route · Persisted to <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">data/leads.json</code>
            </span>
          </div>
          <span className="text-[11px]">Public site visitors cannot view this page without your passcode.</span>
        </div>
      </footer>

      {/* Contact / Send Prospect Modal */}
      {activeProspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-display font-bold text-slate-900">
                  {modalMode === 'contact' ? `Contact ${activeProspect.name}` : `Send Prospect: ${activeProspect.name}`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeProspect.company} · {activeProspect.email}
                </p>
              </div>
              <button
                onClick={() => setActiveProspect(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalMode === 'contact' ? (
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Message</label>
                  <textarea
                    rows={6}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {actionFeedback && (
                  <div
                    className={`p-2.5 rounded-md font-medium ${
                      actionFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {actionFeedback.text}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={() => handleSendOutreach(false)}
                    className="px-3.5 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                  >
                    Log Follow-up Only
                  </button>
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={() => handleSendOutreach(true)}
                    className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email App &amp; Mark Contacted</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchWebhook} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Forward to CRM / Zapier / Make Webhook URL
                  </label>
                  <input
                    type="url"
                    required
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sends this prospect’s full JSON record directly to your external CRM or workflow webhook.
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Handoff Note (optional)</label>
                  <textarea
                    rows={3}
                    value={forwardNote}
                    onChange={(e) => setForwardNote(e.target.value)}
                    placeholder="Context for recipient or CRM record..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {actionFeedback && (
                  <div
                    className={`p-2.5 rounded-md font-medium ${
                      actionFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {actionFeedback.text}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyBrief(activeProspect)}
                    className="px-3 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === activeProspect.id ? 'Brief Copied!' : 'Copy Prospect Brief'}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={actionBusy}
                    className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{actionBusy ? 'Sending...' : 'Send Prospect Payload'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
