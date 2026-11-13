/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ServicesSection } from './components/ServicesSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DiscoverySchedulerModal } from './components/DiscoverySchedulerModal';
import { Chatbot } from './components/Chatbot';
import { FaqSection } from './components/FaqSection';
import { NonprofitModal } from './components/NonprofitModal';
import { OwnerPortalPage } from './components/OwnerPortalPage';

function isOwnerPortalLocation(): boolean {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return (
    path === '/owner' ||
    path === '/admin' ||
    hash === '#owner' ||
    hash === '#admin' ||
    params.get('owner') === 'true' ||
    params.get('admin') === 'true'
  );
}

function isNonprofitLocation(): boolean {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return (
    path === '/nonprofits' ||
    path === '/nonprofit' ||
    hash === '#nonprofits' ||
    hash === '#nonprofit' ||
    params.get('nonprofit') === 'true' ||
    params.get('audience') === 'nonprofit'
  );
}

export default function App() {
  const [isOwnerRoute, setIsOwnerRoute] = useState<boolean>(() => isOwnerPortalLocation());
  const [isNonprofitModalOpen, setIsNonprofitModalOpen] = useState<boolean>(() => isNonprofitLocation());
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [initialNotes, setInitialNotes] = useState<string | undefined>(undefined);

  useEffect(() => {
    const syncRoute = () => {
      setIsOwnerRoute(isOwnerPortalLocation());
      if (isNonprofitLocation()) {
        setIsNonprofitModalOpen(true);
      }
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (isOwnerRoute) {
      document.title = 'Owner Prospect Portal | Corner Stone Solutions';
      if (robotsMeta) robotsMeta.setAttribute('content', 'noindex, nofollow');
      return;
    }

    const isNonprofitPage = isNonprofitLocation();
    document.title = isNonprofitPage
      ? 'Nonprofit Salesforce Consulting (NPSP & NPC) | Corner Stone'
      : 'Corner Stone Solutions | SMB & Nonprofit Salesforce Consulting';
    if (robotsMeta) robotsMeta.setAttribute('content', 'index, follow');

    const canonicalUrl = isNonprofitPage
      ? `${window.location.origin}/nonprofits`
      : `${window.location.origin}/`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.setAttribute('content', canonicalUrl);
  }, [isOwnerRoute, isNonprofitModalOpen]);

  if (isOwnerRoute) {
    return <OwnerPortalPage />;
  }

  const handleOpenScheduler = (serviceTitle?: string, notes?: string) => {
    setSelectedService(serviceTitle);
    setInitialNotes(notes);
    setIsSchedulerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 3-Zone Clean Public Top Bar */}
      <Navbar
        onOpenScheduler={() => handleOpenScheduler()}
        onOpenNonprofitModal={() => setIsNonprofitModalOpen(true)}
      />

      <main className="flex-1">
        {/* Punchy Hero Section */}
        <Hero
          onOpenScheduler={() => handleOpenScheduler()}
          onOpenNonprofitModal={() => setIsNonprofitModalOpen(true)}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Founding Client Trust & Guarantees */}
        <TrustBar />

        {/* 4 Focused Core Services */}
        <ServicesSection
          onSelectService={(serviceTitle) => handleOpenScheduler(serviceTitle)}
          onOpenNonprofitModal={() => setIsNonprofitModalOpen(true)}
        />

        {/* Real Small Business Transformations (Before & After) */}
        <CaseStudiesSection
          onBookCall={(notes) => handleOpenScheduler(undefined, notes)}
        />

        {/* Why Choose a Boutique Partner over Giant Agencies */}
        <WhyUsSection
          onOpenScheduler={() => handleOpenScheduler()}
        />

        {/* Industry Insights & Practical Rules */}
        <BlogSection
          onBookCall={() => handleOpenScheduler()}
        />

        {/* Frequently Asked Questions (Matching FAQPage Schema) */}
        <FaqSection
          onOpenScheduler={() => handleOpenScheduler()}
        />

        {/* Clean Contact & Direct Inquiry */}
        <ContactSection
          onOpenScheduler={() => handleOpenScheduler()}
        />
      </main>

      {/* Quiet Professional Public Footer */}
      <Footer onOpenScheduler={() => handleOpenScheduler()} />

      {/* Nonprofit Solutions (NPSP & NPC) Pop-Up */}
      <NonprofitModal
        isOpen={isNonprofitModalOpen}
        onClose={() => setIsNonprofitModalOpen(false)}
        onBookNonprofitCall={(notes) => handleOpenScheduler('Nonprofit Operations (NPSP & NPC)', notes)}
      />

      {/* Fast, Frictionless Discovery Scheduler Modal */}
      <DiscoverySchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        initialService={selectedService}
        initialNotes={initialNotes}
      />

      {/* Solutions Advisory Chatbot */}
      <Chatbot
        onOpenScheduler={handleOpenScheduler}
        onOpenNonprofitModal={() => setIsNonprofitModalOpen(true)}
      />
    </div>
  );
}
