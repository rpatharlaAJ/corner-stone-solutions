import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are the Virtual Advisory Assistant for "Corner Stone Solutions", a premier boutique Salesforce consulting firm tailored for small and growing businesses (SMBs) and nonprofits.

ABOUT CORNER STONE SOLUTIONS:
1. Core Mission: Help small businesses and nonprofits scale operations efficiently, eliminate spreadsheet chaos, and build unshakeable Salesforce foundations right from Day One.
2. Core Solutions:
   - Salesforce QuickStart for SMBs (3-4 weeks · Fixed price): 5-stage pipeline, calendar/email sync (Google/Outlook), lead routing, executive dashboards, rep training.
   - CRM Health & Process Audit (1-2 weeks · Flat-fee diagnostic): Line-by-line inspection of Flows, orphaned fields, security/sharing rules, license optimization, and 30-day quick win roadmap.
   - Dedicated Admin & Flow Automation (Monthly Retainer · Flexible hours with rollover): Senior certified architect support under 4-hour SLA without the $140k full-time headcount cost.
   - Nonprofit Operations (NPSP & NPC) (3-5 weeks · Fixed scope & nonprofit rate): Support nonprofits managing donors, householding, recurring gifts, grantmaking, fundraising campaigns, and program outcomes using NPSP (Nonprofit Success Pack) or Salesforce Nonprofit Cloud (NPC), including Power of Us guidance.
3. Technical Strengths:
   - Certified Application Architect & Nonprofit Cloud Consultant led.
   - Integrations: QuickBooks, Stripe, Classy, HubSpot, DocuSign, Slack, REST APIs.
   - Special Founding Client Cohort now booking.

STRICT INSTRUCTIONS:
1. Relevancy: ONLY provide information directly relevant to the user's specific question or requirement. Do NOT output unrelated information, lengthy unprompted sales pitches, or generic filler.
2. Tone: Professional, concise, authoritative, and direct. Small business owners have limited time.
3. Suggest Prompts & Next Steps: Provide 2 to 3 concise suggested next prompts that naturally guide the customer toward evaluating their needs and booking a free 30-minute discovery call with Corner Stone Solutions.
4. Output Format:
   Provide your clear, helpful answer first.
   At the very end of your response, strictly include the suggested prompts on a separate line in this exact format:
   <<<SUGGESTIONS>>>["Prompt 1", "Prompt 2", "Prompt 3"]<<<END_SUGGESTIONS>>>
   If the user inquiry expresses strong intent to get started or get in touch, also append:
   <<<ACTION>>>SCHEDULE_CALL<<<END_ACTION>>>`;

// Knowledge base fallback when GEMINI_API_KEY is not configured or times out
function getFallbackAdvisoryResponse(userQuery: string): { reply: string; suggestions: string[]; actionTrigger?: string } {
  const q = userQuery.toLowerCase();

  if (q.includes('nonprofit') || q.includes('non-profit') || q.includes('npsp') || q.includes('npc') || q.includes('donor') || q.includes('grant') || q.includes('fundrais')) {
    return {
      reply: "Our **Nonprofit Operations (NPSP & NPC)** practice helps mission-driven organizations manage donors, grants, and programs cleanly on Salesforce.\n\n**How We Support Nonprofits:**\n• Implementation & optimization on both **Nonprofit Success Pack (NPSP)** and **Salesforce Nonprofit Cloud (NPC)**\n• Donor management, householding, recurring gifts, and automated tax-receipt Flows\n• Grantmaking pipelines, fundraising campaign tracking, and program outcome reporting\n• Donation & accounting integrations (Stripe, Classy, QuickBooks)\n• Staff training and Power of Us (P10) license setup guidance",
      suggestions: [
        "Should we choose NPSP or Nonprofit Cloud (NPC)?",
        "Schedule a 30-min Nonprofit Discovery Call",
        "Can you migrate donor spreadsheets into Salesforce?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('quickstart') || q.includes('4-week') || q.includes('launch') || q.includes('start')) {
    return {
      reply: "Our **Salesforce QuickStart for SMBs** is a fixed-scope, 3 to 4-week implementation designed to get your sales and ops teams live without enterprise consulting bloat.\n\n**Included in Scope:**\n• Standardized 5-stage sales pipeline with required exit criteria\n• Full Gmail or Outlook calendar & email synchronization\n• Automated lead routing & follow-up task triggers\n• Executive dashboard tracking pipeline health, forecast, and rep activity\n• Hands-on team training sessions with recorded video documentation",
      suggestions: [
        "What does the QuickStart cost?",
        "Schedule a 30-min QuickStart Discovery",
        "Can we migrate our existing data?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('audit') || q.includes('health') || q.includes('broken') || q.includes('clunky') || q.includes('cleanup')) {
    return {
      reply: "Our **CRM Health & Process Audit** is a 1 to 2-week flat-fee diagnostic to identify why your team feels Salesforce is clunky and uncover technical debt.\n\n**What We Inspect:**\n• Line-by-line review of Record-Triggered Flows and validation rules\n• Field utilization scan to safely deprecate unused and duplicate fields\n• Security, permission sets, and role hierarchy gaps\n• License audit to stop paying for inactive or unnecessary user seats\n• Prioritized 30-day action plan for immediate quick wins",
      suggestions: [
        "How long does the audit take?",
        "Schedule a CRM Health Audit discussion",
        "What access do you need for the audit?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('admin') || q.includes('retainer') || q.includes('ongoing') || q.includes('fractional') || q.includes('support')) {
    return {
      reply: "Our **Dedicated Admin & Flow Automation** (Expert on Demand) gives small businesses on-demand senior architect support without hiring a $140,000+ full-time employee.\n\n**Key Features:**\n• Guaranteed SLA response under 4 business hours\n• Custom Flow automations, approval matrices, and validation rules\n• Integration maintenance (QuickBooks, Stripe, Slack, DocuSign)\n• Flexible monthly hours with unused hours rolling over to the next month",
      suggestions: [
        "How do monthly hours roll over?",
        "Schedule an Admin Retainer consultation",
        "Can you build custom quoting flows?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('spreadsheet') || q.includes('excel') || q.includes('sheets') || q.includes('migrate') || q.includes('hubspot')) {
    return {
      reply: "We specialize in transitioning growing teams off spreadsheets and disconnected tools into Salesforce.\n\nWe scrub, deduplicate, and map your account, contact, and deal history into a clean data model so your reps stop re-keying data across 14 conflicting sheets and start closing faster.",
      suggestions: [
        "How long does data migration take?",
        "Schedule a 30-min data migration review",
        "Can you import our customer pricing tiers?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('quickbooks') || q.includes('stripe') || q.includes('integrate') || q.includes('integration') || q.includes('erp')) {
    return {
      reply: "Yes, we integrate Salesforce directly with accounting and billing tools including QuickBooks Online, Stripe, NetSuite, and custom ERPs via secure REST APIs and webhooks.\n\nThis automatically creates invoices when opportunities close and syncs payment status back to Salesforce so your reps don't have to chase accounting.",
      suggestions: [
        "How does the QuickBooks sync work?",
        "Schedule an integration scoping call",
        "Can we sync invoice PDFs to customer records?"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('fee')) {
    return {
      reply: "We operate on **transparent, fixed-price scopes** rather than open-ended hourly billing that leads to budget overruns.\n\n• **QuickStart**: Fixed project fee based on team size (3-4 weeks)\n• **Process Audit**: Flat-fee diagnostic (1-2 weeks)\n• **Dedicated Admin**: Predictable monthly retainer with rollover hours\n\nWe provide exact fixed pricing during your free 30-minute discovery session.",
      suggestions: [
        "Schedule a free 30-minute discovery call",
        "What questions will you ask on the call?",
        "View our 3 core services"
      ],
      actionTrigger: 'SCHEDULE_CALL',
    };
  }

  return {
    reply: "Corner Stone Solutions is a boutique Salesforce consulting practice for growing small businesses. We provide 3 core services:\n\n1. **Salesforce QuickStart** (3-4 weeks to clean sales pipelines)\n2. **CRM Health & Process Audit** (1-2 weeks to fix broken flows & technical debt)\n3. **Dedicated Admin & Flow Automation** (Flexible monthly senior architect retainers)\n\nAll projects are led directly by Certified Application Architects with fixed pricing.",
    suggestions: [
      "What is included in the 4-week QuickStart?",
      "How do we book a free 30-min discovery call?",
      "Can you audit our current Salesforce org?"
    ],
    actionTrigger: 'SCHEDULE_CALL',
  };
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMessage = messages[messages.length - 1];
    const userQuery = lastUserMessage?.content || '';

    // Validate that GEMINI_API_KEY is present and not a dummy placeholder
    const rawApiKey = process.env.GEMINI_API_KEY?.trim() || '';
    const hasValidKey = rawApiKey.length > 0 && 
      !rawApiKey.includes('MY_GEMINI_API_KEY') && 
      rawApiKey !== 'undefined' &&
      rawApiKey !== 'null';

    if (!hasValidKey) {
      const fallback = getFallbackAdvisoryResponse(userQuery);
      return res.json(fallback);
    }

    // Ensure Gemini conversation history starts with a 'user' turn (skip initial assistant greeting)
    const firstUserIdx = messages.findIndex((m: { role: string }) => m.role === 'user');
    const conversationTurns = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : messages;

    const contents = conversationTurns.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Call Gemini with gemini-3.1-flash-lite for fast responsive chat
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request exceeded timeout window')), 20000)
    );

    const response: any = await Promise.race([geminiPromise, timeoutPromise]);
    const responseText = response.text || '';

    // Extract suggestions if present
    let cleanText = responseText;
    let suggestions: string[] = [];
    let actionTrigger: string | null = null;

    const suggestionsMatch = responseText.match(/<<<SUGGESTIONS>>>([\s\S]*?)<<<END_SUGGESTIONS>>>/);
    if (suggestionsMatch) {
      try {
        suggestions = JSON.parse(suggestionsMatch[1].trim());
      } catch {
        // Fallback to default parsing
      }
      cleanText = cleanText.replace(/<<<SUGGESTIONS>>>[\s\S]*?<<<END_SUGGESTIONS>>>/, '').trim();
    }

    const actionMatch = responseText.match(/<<<ACTION>>>([\s\S]*?)<<<END_ACTION>>>/);
    if (actionMatch) {
      actionTrigger = actionMatch[1].trim();
      cleanText = cleanText.replace(/<<<ACTION>>>[\s\S]*?<<<END_ACTION>>>/, '').trim();
    }

    if (suggestions.length === 0) {
      suggestions = [
        "What's included in the 4-week QuickStart?",
        "Schedule a 30-min discovery call with an architect",
        "How do you handle QuickBooks integration?"
      ];
    }

    return res.json({
      reply: cleanText,
      suggestions,
      actionTrigger,
    });
  } catch {
    // Graceful fallback to domain advisory engine without throwing unhandled exceptions
    const lastUserMessage = req.body?.messages?.[req.body?.messages?.length - 1];
    const fallback = getFallbackAdvisoryResponse(lastUserMessage?.content || '');
    return res.json(fallback);
  }
});

// Helper functions for Leads persistence
const leadsFilePath = path.join(__dirname, 'data', 'leads.json');

function readLeads() {
  try {
    if (!fs.existsSync(leadsFilePath)) {
      fs.mkdirSync(path.dirname(leadsFilePath), { recursive: true });
      fs.writeFileSync(leadsFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(leadsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading leads.json:', err);
    return [];
  }
}

function writeLeads(leads: any[]) {
  try {
    fs.mkdirSync(path.dirname(leadsFilePath), { recursive: true });
    fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error('Error writing leads.json:', err);
  }
}

// GET /api/leads - Fetch all inquiries and booked discovery calls
app.get('/api/leads', (_req, res) => {
  const leads = readLeads();
  // Return sorted with newest first
  leads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ leads, total: leads.length });
});

// POST /api/leads - Save a new discovery booking or contact inquiry from the public page
app.post('/api/leads', (req, res) => {
  try {
    const { name, email, phone, company, type, serviceFocus, date, timeSlot, timezone, message, source, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const leads = readLeads();
    const newLead = {
      id: `lead-${Date.now()}`,
      type: type || 'contact_inquiry', // 'discovery_booking' | 'contact_inquiry'
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: phone || '',
      company: company || 'Not specified',
      serviceFocus: serviceFocus || 'General Salesforce Solutions',
      date: date || '',
      timeSlot: timeSlot || '',
      timezone: timezone || 'Eastern Time (US & Canada)',
      message: message || '',
      status: 'New',
      source: source || 'website',
      notes: notes || '',
      outreachHistory: [],
    };

    leads.unshift(newLead);
    writeLeads(leads);

    console.log(`[Lead Captured] New ${newLead.type} from ${newLead.name} (${newLead.company})`);
    return res.status(201).json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error('Error saving lead:', err);
    return res.status(500).json({ error: 'Failed to record lead.' });
  }
});

// PATCH /api/leads/:id - Update status or notes for a lead
app.patch('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const leads = readLeads();
    const idx = leads.findIndex((l: any) => l.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    if (status !== undefined) leads[idx].status = status;
    if (notes !== undefined) leads[idx].notes = notes;

    writeLeads(leads);
    return res.json({ success: true, lead: leads[idx] });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update lead.' });
  }
});

// POST /api/leads/:id/outreach - Log outreach to a prospect or forward prospect brief via webhook
app.post('/api/leads/:id/outreach', async (req, res) => {
  try {
    const { id } = req.params;
    const { channel, subject, summary, webhookUrl, nextStatus } = req.body;
    const leads = readLeads();
    const idx = leads.findIndex((l: any) => l.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    if (webhookUrl) {
      const parsed = new URL(webhookUrl);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return res.status(400).json({ error: 'Invalid webhook URL protocol.' });
      }
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'cornerstone.prospect_dispatched',
          dispatchedAt: new Date().toISOString(),
          prospect: leads[idx],
          note: summary || '',
        }),
      });
      if (!webhookRes.ok) {
        return res.status(502).json({ error: `Webhook target returned HTTP ${webhookRes.status}` });
      }
    }

    const entry = {
      id: `out-${Date.now()}`,
      sentAt: new Date().toISOString(),
      channel: channel || 'email',
      subject: subject || 'Follow-up from Corner Stone Solutions',
      summary: summary || '',
    };

    const existingHistory = Array.isArray(leads[idx].outreachHistory) ? leads[idx].outreachHistory : [];
    leads[idx].outreachHistory = [entry, ...existingHistory];
    leads[idx].lastContactedAt = entry.sentAt;
    if (nextStatus) {
      leads[idx].status = nextStatus;
    } else if (leads[idx].status === 'New') {
      leads[idx].status = 'Contacted';
    }

    writeLeads(leads);
    return res.json({ success: true, lead: leads[idx] });
  } catch (err: any) {
    console.error('Error recording outreach:', err);
    return res.status(500).json({ error: err?.message || 'Failed to record prospect outreach.' });
  }
});

// DELETE /api/leads/:id - Remove a test lead
app.delete('/api/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    let leads = readLeads();
    const initialLen = leads.length;
    leads = leads.filter((l: any) => l.id !== id);

    if (leads.length === initialLen) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    writeLeads(leads);
    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete lead.' });
  }
});

// Technical SEO endpoints: robots.txt, sitemap.xml, and crawler protection for owner routes
function resolveBaseUrl(req: express.Request): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && !configured.includes('MY_APP_URL')) {
    return configured.replace(/\/+$/, '');
  }
  const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
  const host = req.get('host') || `localhost:${port}`;
  return `${proto}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  const baseUrl = resolveBaseUrl(req);
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /owner',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join('\n')
  );
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = resolveBaseUrl(req);
  const lastmod = new Date().toISOString().split('T')[0];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  );
});

app.use(['/owner', '/admin'], (_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// In development, hook Vite middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Corner Stone Solutions server running on http://0.0.0.0:${port}`);
  });
}

startServer();
