export const HERO_IMAGE = '/src/assets/images/hero_consulting_office_1794212882004.jpg';

export const CERTIFICATIONS = [
  'Salesforce Certified Application Architect',
  'Salesforce Certified Sales Cloud Consultant',
  'Salesforce Certified Platform App Builder',
  'Salesforce Certified Agentforce Specialist',
];

export const CORE_SERVICES = [
  {
    id: 'quickstart',
    number: '01',
    title: 'Salesforce QuickStart for SMBs',
    tagline: 'Up and running with clean sales workflows in 3 to 4 weeks.',
    timeline: '3 - 4 Weeks',
    pricing: 'Fixed Scope & Price',
    description: 'Designed specifically for small teams transitioning out of spreadsheets, HubSpot, or email chaos into a structured Salesforce Sales Cloud org.',
    highlights: [
      'Tailored 5-stage sales pipeline with required exit criteria',
      'Two-way Gmail or Outlook calendar & email sync',
      'Automated lead routing & follow-up task triggers',
      'Executive dashboard: Pipeline Health, Revenue Forecast & Rep Activity',
      'Hands-on team onboarding & recorded video library',
    ],
  },
  {
    id: 'audit',
    number: '02',
    title: 'CRM Health & Process Audit',
    tagline: 'Fix broken flows, eliminate clutter, and optimize licenses.',
    timeline: '1 - 2 Weeks',
    pricing: 'Flat-Fee Diagnostic',
    description: 'If your team feels Salesforce is "clunky" or reps avoid using it, we conduct a surgical audit to identify technical debt, failing flows, and licensing waste.',
    highlights: [
      'Line-by-line inspection of Flow automations and validation rules',
      'Field utilization scan (flagging unused and duplicate fields)',
      'Security, sharing rules, and user role hierarchy review',
      'License cleanup to eliminate paying for unused seats',
      'Prioritized 30-day action plan for immediate quick wins',
    ],
  },
  {
    id: 'managed-admin',
    number: '03',
    title: 'Dedicated Admin & Flow Automation',
    tagline: 'Senior certified architect on retainer without the $140k full-time salary.',
    timeline: 'Monthly Retainer',
    pricing: 'Flexible Hours · Rollover',
    description: 'Ongoing technical leadership and day-to-day configuration for growing companies that need reliable CRM momentum without adding full-time overhead.',
    highlights: [
      'Guaranteed response SLA under 4 business hours',
      'Custom Flow automations (quotes, onboarding, approval matrices)',
      'ERP & tool sync (QuickBooks, Stripe, Slack, Zapier)',
      'Quarterly Salesforce seasonal release audits',
      'Month-to-month flexibility with unused hour rollover',
    ],
  },
];

export const TRANSFORMATIONS = [
  {
    id: 'quoting',
    industry: 'Wholesale & Equipment',
    title: 'From 5-Day Spreadsheet Quotes to 1-Click Contracts',
    image: '/src/assets/images/casestudy_manufacturing_1794212882389.jpg',
    before: 'Sales reps calculated discount tiers in 14 conflicting Excel sheets, resulting in margin errors and 5-day quote turnaround times.',
    after: 'Standardized Salesforce Price Books with automated margin validation and 1-click DocuSign quotes. Average turnaround cut to 1.8 days.',
    metric: '64% Faster Turnaround',
  },
  {
    id: 'operations',
    industry: 'Professional & Advisory Services',
    title: 'Eliminating the "Messy Email Hand-Off" Post-Sale',
    image: '/src/assets/images/casestudy_fintech_1794212883403.jpg',
    before: 'Closed deals were handed over to operations via disjointed email chains, resulting in delayed onboarding and missed client deadlines.',
    after: 'Automated Flow creates onboarding projects, notifies ops team with all client intake requirements, and triggers introductory welcome portals.',
    metric: '71% Faster Client Onboarding',
  },
  {
    id: 'visibility',
    industry: 'Healthcare & Clinical Services',
    title: 'Executive Real-Time Pipeline Visibility',
    image: '/src/assets/images/casestudy_healthcare_1794212884229.jpg',
    before: 'Founders had to wait for monthly spreadsheet reconciliations to know actual pipeline numbers and revenue forecasts.',
    after: 'Live executive dashboards showing weighted pipeline, conversion rates by stage, and upcoming invoice schedules in real-time.',
    metric: '100% Real-Time Visibility',
  },
];

export const INSIGHTS = [
  {
    id: 'mistakes',
    title: '5 Salesforce Mistakes Small Businesses Make (And How to Avoid Them)',
    category: 'SMB Strategy',
    readTime: '4 min read',
    summary: 'Why buying enterprise licenses too early and adding 50 custom fields creates expensive friction for sales reps.',
    points: [
      'Avoid the "custom field for everything" trap — only create fields that drive executive reports or automated flows.',
      'Define clear exit criteria for each sales pipeline stage before building automations.',
      'Consolidate multiple conflicting flows into one orchestrator flow per object to prevent system slowdowns.',
      'Train reps on day-to-day workflow shortcuts rather than overwhelming them with admin settings.',
    ],
  },
  {
    id: 'flows',
    title: 'Salesforce Flow Best Practices for Growing Teams',
    category: 'Automation',
    readTime: '5 min read',
    summary: 'A plain-English guide to automating handoffs, approvals, and reminders without writing expensive custom code.',
    points: [
      'Use Before-Save flows for same-record updates to maximize processing speed.',
      'Never execute SOQL queries or database updates inside loops.',
      'Build modular sub-flows for repeated actions like notifications and task assignments.',
      'Always document entry criteria so future team members know why an automation exists.',
    ],
  },
  {
    id: 'roi',
    title: 'How Small Businesses Measure Real CRM ROI in Year One',
    category: 'RevOps',
    readTime: '3 min read',
    summary: 'Focus on time saved per sales rep and pipeline velocity rather than vanity metrics.',
    points: [
      'Measure hours recaptured from manual quoting and data re-entry (typically 4-6 hours/rep/week).',
      'Track reduction in quote-to-close turnaround times.',
      'Monitor contract renewal retention rates through automated 60-day alerts.',
      'Calculate revenue unlocked from eliminating dropped follow-up tasks.',
    ],
  },
];
