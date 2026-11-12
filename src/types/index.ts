export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  timeline: string;
  idealFor: string;
  deliverables: string[];
  clouds: string[];
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  headline: string;
  heroImage: string;
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  challenge: string;
  solution: string;
  architectureDetails: string[];
  results: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: 'Architecture & Flow' | 'RevOps & Growth' | 'SMB Strategy' | 'AI & Automation';
  readTime: string;
  date: string;
  content: {
    introduction: string;
    keyPoints: {
      heading: string;
      body: string;
    }[];
    takeaways: string[];
  };
}

export interface BookingFormState {
  serviceId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  companySize: string;
  currentCrm: string;
  primaryGoal: string;
  date: string;
  timeSlot: string;
  timezone: string;
  notes: string;
}
