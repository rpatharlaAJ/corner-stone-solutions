# Corner Stone Solutions — Salesforce Consulting Platform

> Specialized Salesforce consulting and RevOps optimization for small and growing businesses. Inspired by high-trust boutique partner agencies.

![Corner Stone Solutions](https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**Corner Stone Solutions** is a modern, high-conversion web platform built for an agile Salesforce consulting firm. It bridges the gap between boutique, high-touch advisory and enterprise-grade Salesforce implementation.

### Key Features
- **Client-Facing Landing Page**:
  - **Core Solutions**: QuickStart Implementation (21-Day Launch), CRM Health Audit & Architecture, Dedicated Fractional Admin & Flow Automation.
  - **Transformation Case Studies**: Before/after metric breakdowns (adoption, pipeline velocity, automated lead routing).
  - **Interactive Discovery Scheduler**: 30-minute discovery booking calendar with live timezone formatting and automated `.ics` calendar invitation download.
  - **Tactical Best-Practice Guides**: Practical SMB Salesforce guides with instant reading drawer.
  - **Contact & Inquiry Form**: Streamlined 4-field inquiry capture.
- **Smart AI Advisory Chatbot**:
  - Powered by Google Gemini (`@google/genai` with server-side validation).
  - Multi-turn conversation engine strictly focused on Salesforce solutions, RevOps, and project scoping.
  - Clickable suggested prompts that guide prospects directly to discovery bookings.
- **Secure Owner Admin Portal**:
  - Completely isolated from public visitors via passcode authentication (Default PIN: `2026`).
  - Access via `/#admin`, `?admin=true`, keyboard hotkey (`Ctrl + Shift + A`), or the discreet footer lock.
  - Lead management workflow: `New` → `Contacted` → `Call Completed` → `Proposal Sent` → `Archived`.
  - Inline private call notes saved directly to persistent storage.
  - One-click CSV export of all inquiries and scheduled bookings.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion (Framer Motion).
- **Backend**: Node.js, Express, `tsx`.
- **AI Engine**: Google Gemini API (`@google/genai`).
- **Storage**: Persistent JSON database (`/data/leads.json`) with atomic write updates.
- **Build & Dev Tooling**: Vite 8, TypeScript 7.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm, yarn, or pnpm
- (Optional) [Google Gemini API Key](https://aistudio.google.com/) for live AI chatbot responses.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/corner-stone-solutions.git

# Navigate into the project directory
cd corner-stone-solutions

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Gemini API Key (optional - fallback advisory engine activates if omitted)
GEMINI_API_KEY="your-gemini-api-key"

# App URL (optional for self-referential links)
APP_URL="http://localhost:3000"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── data/
│   └── leads.json            # Persistent storage for inquiries and bookings
├── src/
│   ├── components/
│   │   ├── BlogSection.tsx             # Tactical guides & reading modal
│   │   ├── CaseStudiesSection.tsx      # Before/After client transformations
│   │   ├── Chatbot.tsx                 # Gemini AI assistant with suggested prompts
│   │   ├── ContactSection.tsx          # Public inquiry form
│   │   ├── DiscoverySchedulerModal.tsx # Interactive 30-min discovery scheduler
│   │   ├── Footer.tsx                  # Clean public footer
│   │   ├── Hero.tsx                    # Punchy value prop & launch badge
│   │   ├── Navbar.tsx                  # Public responsive navigation
│   │   ├── OwnerPortalPage.tsx         # Standalone password-protected owner portal (/owner)
│   │   ├── ServicesSection.tsx         # 3 Core consulting packages
│   │   ├── TrustBar.tsx                # Certified Salesforce credentials & guarantees
│   │   └── WhyUsSection.tsx            # Boutique vs. traditional agency comparison
│   ├── App.tsx               # Root component wiring sections & admin routing
│   ├── main.tsx              # React DOM entry point
│   └── index.css             # Tailwind CSS entry point
├── server.ts                 # Express server with Vite middleware & Gemini API proxy
├── package.json              # Scripts & dependencies
├── vite.config.ts            # Vite & Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🔐 Owner Portal Access (Separate Page)

The public website (`/`) contains **no links or buttons** to the Owner Inbox or Owner Portal. Inquiries, booked discovery calls, and chatbot prospects submitted on `/` are sent directly to the separate Owner Portal page:
1. **Direct URL**: Navigate to `/owner` (e.g., `http://localhost:3000/owner` or `/admin`)
2. **Default Passcode**: `2026` (changeable in `OwnerPortalPage.tsx`)
3. **Actions**: View incoming prospects, log/send email outreach, copy or dispatch prospect briefs via webhook, manage pipeline status, and export CSV.

---

## 🚢 Deployment

### Production Build
```bash
# Build production client bundle
npm run build

# Start production server
npm run start
```

### Cloud Run / Docker
This application is container-ready. Set the start command to:
```bash
node --loader tsx server.ts
# or
npm run start
```
Port: `3000` (or dynamic `process.env.PORT`).

---

## 📄 License
MIT License. Built for Corner Stone Solutions.
