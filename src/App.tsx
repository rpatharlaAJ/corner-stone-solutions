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
import { AdminLeadPortal } from './components/AdminLeadPortal';

export default function App() {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isLeadPortalOpen, setIsLeadPortalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [initialNotes, setInitialNotes] = useState<string | undefined>(undefined);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) {
          const newOnes = data.leads.filter((l: any) => l.status === 'New').length;
          setUnreadLeadsCount(newOnes);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenScheduler = (serviceTitle?: string, notes?: string) => {
    setSelectedService(serviceTitle);
    setInitialNotes(notes);
    setIsSchedulerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 3-Zone Clean Top Bar */}
      <Navbar 
        onOpenScheduler={() => handleOpenScheduler()} 
        onOpenLeadPortal={() => setIsLeadPortalOpen(true)}
        unreadCount={unreadLeadsCount}
      />

      <main className="flex-1">
        {/* Punchy Hero Section */}
        <Hero
          onOpenScheduler={() => handleOpenScheduler()}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Founding Client Trust & Guarantees */}
        <TrustBar />

        {/* 3 Focused Core Services */}
        <ServicesSection
          onSelectService={(serviceTitle) => handleOpenScheduler(serviceTitle)}
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

        {/* Clean Contact & Direct Inquiry */}
        <ContactSection
          onOpenScheduler={() => handleOpenScheduler()}
        />
      </main>

      {/* Quiet Professional Footer */}
      <Footer 
        onOpenScheduler={() => handleOpenScheduler()} 
        onOpenLeadPortal={() => setIsLeadPortalOpen(true)}
      />

      {/* Fast, Frictionless Discovery Scheduler Modal */}
      <DiscoverySchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        initialService={selectedService}
        initialNotes={initialNotes}
      />

      {/* Solutions Advisory Chatbot */}
      <Chatbot onOpenScheduler={handleOpenScheduler} />

      {/* Owner Inquiries & Booked Calls Management Portal */}
      <AdminLeadPortal
        isOpen={isLeadPortalOpen}
        onClose={() => setIsLeadPortalOpen(false)}
        onLeadCountChange={setUnreadLeadsCount}
      />
    </div>
  );
}
