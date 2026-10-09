# BookFlow MVTS v1 — Formal UI/UX Design Foundation & System Specification (Authoritative Foundation — Updated & Frozen)

**Status:** Authoritative Foundation (Updated & Frozen)  
**Version:** v1.1  
**Change Note:** Updated to include the Platform Administrator actor, Business Profile & Owner Account Management, Public Booking Link/Profile Settings, Owner Account & Security, and corresponding navigation, authorization, responsive behavior, and MVP scope rules.  
**Phase:** MVTS v1 (Academic Prototype)  
**Platform Target:** Modern Responsive Web Application (Desktop SaaS Primary; Tablet & Mobile Web Secondary)  
**Stack Alignment:** Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, ASP.NET Core 8 Web API, SQL Server.

---

## 1. Product Design Direction & Brand Philosophy

BookFlow is an appointment booking and lightweight customer relationship management (CRM) platform designed specifically for independent, single-operator service businesses (salons, barbershops, wellness consultants, private tutors, auto detailers, solo repair specialists).

### Core Brand Attributes
- **Trustworthy & Reliable:** Calibrated contrast, structured layouts, and clear affordances reassure solo owners, clients, and platform administrators.
- **Calm & Uncluttered:** Thoughtful whitespace rhythm and restrained accent usage prevent visual cognitive fatigue during busy business days.
- **Modern Desktop SaaS Polish:** Engineered as a high-fidelity web application rather than an emulated native mobile app.
- **Efficient & Scannable:** Data-dense views (agendas, CRM lists, service tables, admin directories) maximize immediate legibility without visual chaos.
- **Approachable & Simple:** Clear hierarchy, low jargon, and self-evident interactions across owner portal, public booking, and administrative workflows.

---

## 2. Product Actors & Authorization Boundaries

The BookFlow system establishes **three authoritative actors** with strict security and authorization boundaries:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BOOKFLOW AUTHORIZATION BOUNDARIES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. PLATFORM ADMINISTRATOR                                                   │
│    • Authenticated separate admin portal (`/admin`)                        │
│    • Platform-wide administrative visibility, directories & aggregate KPIs   │
│    • Zero business owner operations; zero direct booking capabilities       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. BUSINESS OWNER                                                           │
│    • Authenticated SaaS portal for solo operators (`/portal`)              │
│    • Business profile, services, schedule, CRM, appointments & account     │
│    • Strictly partitioned to own business data; zero platform admin access │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. CLIENT / CUSTOMER                                                        │
│    • Accountless, frictionless public guest booking journey only (`/b/slug`)│
│    • Service selection ➔ Date/Time ➔ Contact (Strict 3) ➔ Review ➔ Status   │
│    • Zero access to owner portal; zero access to administrative portal      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Actor 1 — Business Owner (Authenticated SaaS Portal)
The Business Owner operates an individual BookFlow business.
- **Responsibilities:**
  - Register and authenticate into the owner SaaS portal.
  - Manage business profile (name, logo, contact phone, contact email, location, category, currency symbol, bio).
  - Manage public booking link and profile settings (`bookflow.me/b/[slug]`).
  - Manage service catalog (CRUD, durations, informational prices, active toggles).
  - Manage weekly operational hours and custom unavailable/blocked periods.
  - Manage single-operator appointments (calendar/agenda, confirm, reschedule, cancel).
  - Manage customer CRM records (auto-populated directory, client details, appointment history, internal owner notes).
  - View executive dashboard metrics (Today's, Upcoming, Active Customers, Completed).
  - Manage owner account & security settings (email overview, password update, secure logout).
- **Boundary:** Strictly partitioned to own business data. Zero access to platform administration or other businesses' data.

### Actor 2 — Client / Customer (Accountless Guest Web Experience)
The Customer is an accountless public booking user.
- **Responsibilities:**
  - Open a business's public booking page (`bookflow.me/b/[slug]`).
  - Browse active services with durations and transparent pricing.
  - Select active service.
  - Select date via interactive calendar.
  - Select verified available time slot (real-time double-booking prevention).
  - Enter guest contact details strictly limited to **3 fields**:
    1. Full Name — *Required*
    2. Phone Number — *Required*
    3. Email — *Optional*
  - Review appointment summary.
  - Receive read-only booking confirmation with reference code (e.g. `#BK-8942`) and `Pending` status.
- **Boundary:** Strictly accountless. The customer does NOT create an account, log in, access a customer portal, cancel their booking, reschedule their booking, manage a profile, access CRM data, or access owner portal screens.

### Actor 3 — Platform Administrator (Platform Administrative Portal)
The Platform Administrator manages the BookFlow platform at the system level. The Platform Administrator is NOT a business owner and is NOT a customer.
- **Responsibilities:**
  - Authenticate through a protected, separate administrator portal.
  - View platform-level dashboard information (aggregate KPIs and recent platform activity).
  - View registered businesses directory (search, filter, status, owner, registration date, counts).
  - Open and inspect business details (business profile, owner info, platform usage data).
  - View basic platform usage metrics and activity indicators.
  - Monitor overall platform activity at a high level.
- **Boundary:** The Platform Administrator does NOT operate a business on behalf of an owner, create customer bookings, manage individual business services as if they were the owner, modify appointments through the customer booking flow, access customer booking pages as a normal user, perform payment processing, perform advanced financial analytics, perform predictive analytics, manage multiple business staff, or use customer self-service features.

---

## 3. Platform Architecture & Form Factor Constraints

### Form Factor Definition
- **Primary Experience:** Desktop SaaS browser viewport (1024px – 1440px+). Clean left navigation bar, structured header, maximum content container widths, and 12-column grid arrangements.
- **Secondary Responsive Experiences:**
  - **Tablet Web Browser (640px – 1024px):** Collapsible navigation drawer/rail, 2-column or adaptable single-column metric grids, card-wrapped table transformations, touch targets ≥ 44px.
  - **Mobile Web Browser (< 640px):** Responsive web top navigation bar with clean slide-over drawer, single-column stacks, full-width touch-friendly actions (min 44px touch targets).

### Explicit Anti-Patterns & Exclusions (Enforced)
- **NOT a Native Mobile App:** No bottom mobile tab bars, no native iOS/Android system chrome, no swipe gesture reliance.
- **NOT an Installed PWA in v1:** No "Install App" banners, no offline status badges, no push notification prompts, no service worker UI.
- All layouts are standard, highly responsive modern web pages running in mobile/desktop web browsers.

---

## 4. Product Structure & Navigation Models

The BookFlow platform consists of three distinct experience areas with completely isolated navigation structures:

```
BOOKFLOW PLATFORM
├── Public Landing Page (Marketing, Features, How It Works, Auth Entry Points)
│
├── Business Owner Portal (Authenticated SaaS Shell)
│   ├── Dashboard (Executive KPIs, Today's Agenda, Quick Actions)
│   ├── Appointments (Calendar & Agenda Management, Status Actions)
│   ├── Services (Service Catalog CRUD, Active Toggles)
│   ├── Availability (Weekly Working Hours & Blocked Dates)
│   ├── Customers (CRM Directory, Profile, History, Internal Notes)
│   ├── Business Profile & Settings (Profile Info, Image/Logo, Public Link & Preview)
│   └── Account & Security (Owner Email, Password Change, Logout)
│
├── Public Customer Booking (Accountless Linear Flow)
│   ├── Service Selection (Active Services, Duration, Price)
│   ├── Date & Time (Live Calendar, Real-time Slot Availability)
│   ├── Customer Information (Full Name, Phone Number, Optional Email)
│   ├── Review (Summary, Edit Shortcuts, Informational Terms)
│   └── Booking Confirmation (Read-Only Summary, Reference Code, Pending Status)
│
└── Platform Administrator Portal (Dedicated Admin SaaS Shell)
    ├── Admin Dashboard (Platform Aggregate KPIs & Activity)
    ├── Businesses (Platform Business Directory, Search & Filters)
    ├── Business Details (Owner Info, Business Profile, Usage Overview)
    ├── Platform Analytics / Usage (High-Level Usage & Platform Volume)
    └── Admin Account & Security (Admin Credentials & Session Logout)
```

*Note: The Admin navigation and Business Owner navigation remain completely distinct and isolated shells. Neither is reused for the other.*

---

## 5. Color Palette & Token Architecture

The color system utilizes a primary indigo anchor supported by subtle teal highlights, balanced over crisp neutral slate surfaces and strict 1px border geometry. The same design tokens apply across the Owner Portal, Public Booking Flow, and Administrator Portal.

### Core Brand Tokens
| Token Name | Hex Code | Tailwind Utility | Functional Application |
| :--- | :--- | :--- | :--- |
| `primary` | `#2563EB` | `bg-blue-600` / `text-blue-600` | Primary buttons, active nav items, key link focus, calendar selections |
| `primary-hover` | `#1D4ED8` | `bg-blue-700` / `hover:bg-blue-700` | Primary interactive hover state |
| `primary-subtle` | `#EFF6FF` | `bg-blue-50` | Primary selected row highlight, light tint background |
| `secondary-accent`| `#0D9488` | `bg-teal-600` / `text-teal-600` | Supporting accent, subtle progress indicators, secondary badge highlights |
| `secondary-hover` | `#0F766E` | `bg-teal-700` | Accent hover state |
| `background` | `#F8FAFC` | `bg-slate-50` | Global application canvas background |
| `surface` | `#FFFFFF` | `bg-white` | Cards, modals, tables, navigation containers |
| `surface-secondary`| `#F1F5F9` | `bg-slate-100` | Table headers, secondary button bg, input disabled state, neutral pills |
| `surface-tertiary` | `#E2E8F0` | `bg-slate-200` | Dividers, subtle separator lines |
| `border` | `#E2E8F0` | `border-slate-200` | Default component borders (cards, inputs, table rows) |
| `border-hover` | `#CBD5E1` | `border-slate-300` | Input hover, card interactive hover |
| `border-focus` | `#2563EB` | `border-blue-600` | Form field keyboard focus ring |
| `text-primary` | `#0F172A` | `text-slate-900` | Primary headings, prominent values, active labels |
| `text-secondary` | `#475569` | `text-slate-600` | Body copy, table data cells, supporting descriptive copy |
| `text-muted` | `#94A3B8` | `text-slate-400` | Field helper text, placeholder strings, inactive icons |

---

## 6. Semantic Status System (Appointment Lifecycles Only)

BookFlow statuses apply **strictly** to business appointment states. There are **zero** financial, billing, or deposit implications associated with these statuses.

### Appointment Status Specifications
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPOINTMENT PIPELINE                             │
│                                                                             │
│   [ Client Books ] ───►  Pending   ───►  Confirmed   ───►   Completed       │
│                             │                  │                            │
│                             └──────────┬───────┘                            │
│                                        ▼                                    │
│                                    Cancelled                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Status | Text Color | Bg Tint Color | Border Color | Icon Graphic | Meaning & Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Pending`** | `#B45309` (`#F59E0B`) | `#FEF3C7` | `#FCD34D` | Clock / Dot | Appointment created by guest; awaiting business-owner confirmation. (No payment link). |
| **`Confirmed`** | `#0369A1` (`#0284C7`) | `#E0F2FE` | `#BAE6FD` | Checkmark | Appointment confirmed by business owner. |
| **`Completed`** | `#047857` (`#059669`) | `#D1FAE5` | `#A7F3D0` | Solid Circle Check | Service has been rendered and concluded. |
| **`Cancelled`** | `#BE123C` (`#E11D48`) | `#FFE4E6` | `#FECDD3` | Cross / Slash | Appointment cancelled by the business owner. |

### Strict Status Accessibility Rule
Status badges must never rely on color alone. Each badge features:
1. High-contrast text label (e.g. `Pending`, `Confirmed`).
2. Distinct visual icon indicator (Clock, Check, Circle, Cross).
3. Minimum contrast ratio of 4.5:1 against the tinted badge surface.

---

## 7. Typography System (Inter Sans-Serif)

Strict, purposeful typographic scale calibrated for data legibility, metric glanceability, and structured forms.

| Style Role | Font Size | Line Height | Weight | Tailwind Class | Typical Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | 32px (2rem) | 38px (1.2) | SemiBold (600) | `text-3xl font-semibold` | Public booking business name hero, auth landing |
| **Page Heading** | 24px (1.5rem) | 32px (1.33) | SemiBold (600) | `text-2xl font-semibold` | Owner portal view titles, admin titles |
| **Section Heading**| 18px (1.125rem)| 26px (1.44) | SemiBold (600) | `text-lg font-semibold` | Card cluster titles, modal headers, table headers |
| **Card Heading** | 16px (1rem) | 24px (1.5) | Medium (500) | `text-base font-medium` | Metric card labels, service item titles |
| **Metric Value** | 28px (1.75rem)| 34px (1.2) | Bold (700) | `text-2xl lg:text-3xl font-bold` | Dashboard KPI numbers (e.g., "12", "48") |
| **Body Primary** | 14px (0.875rem)| 20px (1.42) | Regular (400) | `text-sm font-normal` | Table cell data, descriptions, standard form inputs |
| **Body Secondary**| 13px (0.8125rem)| 18px (1.38) | Regular (400) | `text-xs font-normal` | Field helper text, timestamps, subtle subtitles |
| **Label / Caption**| 12px (0.75rem) | 16px (1.33) | Medium (500) | `text-xs font-medium uppercase tracking-wider` | Form field labels, table column headers, status tags |
| **Button Text** | 14px (0.875rem)| 20px (1.42) | Medium (500) | `text-sm font-medium` | All interactive button triggers |

---

## 8. Spacing & Spatial Rhythm (8-Point Grid)

All layout containers, margins, paddings, and component heights adhere to an 8pt geometric rhythm.

| Token | Dimension | Tailwind Value | Common Implementation |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | `p-1`, `gap-1` | Micro spacing (icon-to-text gap in badges) |
| `space-2` | 8px | `p-2`, `gap-2` | Element internal padding, compact button padding |
| `space-3` | 12px | `p-3`, `gap-3` | Standard input vertical padding, table row compact gap |
| `space-4` | 16px | `p-4`, `gap-4` | Standard card internal padding, form field vertical stack |
| `space-6` | 24px | `p-6`, `gap-6` | Card outer margins, dashboard grid gap, modal padding |
| `space-8` | 32px | `p-8`, `gap-8` | Large card padding, section separators |
| `space-10`| 40px | `h-10` | Standard form input and button height (40px) |
| `space-12`| 48px | `p-12`, `gap-12`| Large section stack, empty state vertical breathing room |
| `space-16`| 64px | `p-16` | Major page section padding |

### Border Radius Tokens
- `rounded-sm`: 4px (Status tags, micro badges)
- `rounded-md`: 6px (Form controls, dropdown items, secondary buttons)
- `rounded-lg`: 8px (Default cards, primary buttons, modals, calendar tiles)
- `rounded-xl`: 12px (Metric stat cards, guest booking container card)
- `rounded-full`: 9999px (Pills, avatar circles)

---

## 9. Component Design Language & Specifications

### 9.1 Buttons
- **Primary:** `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`. Used for primary confirmations, adding a service, confirming an appointment, saving profile.
- **Secondary:** `bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors`. Used for filters, cancel modal dismissals, edit triggers, copy link.
- **Ghost / Tertiary:** `text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium`. Used for pagination controls, icon utility triggers.
- **Destructive:** `bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 active:bg-rose-100 rounded-lg px-4 py-2.5 text-sm font-medium`. Used for cancelling appointments, deactivating services.

### 9.2 Form Controls
- **Inputs (Text, Phone, Email, Number):** Height 40px (`h-10`), `bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all`.
- **Textarea (Owner Internal Notes / Business Bio):** Same styling with min-height 96px (`min-h-24`), comfortable line-height for internal owner notes and business description.
- **Select Dropdown:** Native-styled custom chevron, clean 40px height, consistent padding and focus ring.
- **Toggle Switch:** 20px height track (`w-11 h-6 bg-slate-200 rounded-full transition-colors peer-checked:bg-blue-600`), 16px white knob. Used for toggling service active/inactive status and day availability.
- **Form Labels & Validation:** Labels positioned above input in `text-xs font-medium text-slate-700 mb-1.5`. Clear visual `*` for required fields and `(optional)` badge for optional fields (e.g. customer email). Validation errors appear beneath in `text-xs text-rose-600 mt-1`.

### 9.3 Cards & Data Display
- **Standard Card:** `bg-white border border-slate-200 rounded-lg p-6 shadow-xs`.
- **Metric Card:** Clean KPI presentation containing:
  1. Subtle category icon in top-right (`p-2 rounded-md bg-slate-100 text-slate-600`).
  2. Subtitle caption in `text-xs font-medium uppercase tracking-wider text-slate-500`.
  3. Bold quantitative value in `text-3xl font-bold text-slate-900 mt-1`.
  4. Contextual subtext in `text-xs text-slate-500 mt-2` (e.g., "Across current work week" or "Platform-wide volume").
- **Tables (Desktop):**
  - **Header (`<thead>`):** `bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4 text-left`.
  - **Row (`<tr>`):** `border-b border-slate-100 hover:bg-slate-50/75 transition-colors py-3.5 px-4 text-sm text-slate-700`.
  - **Action Menu:** Compact right-aligned action buttons (Confirm, Reschedule, Cancel, View Details, Edit).

### 9.4 Modals & Dialog Patterns
- **Backdrop:** `fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4`.
- **Dialog Box:** `bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95`.
- **Header:** Title in `text-lg font-semibold text-slate-900`, close button top-right.
- **Footer:** Action row with right-aligned `Secondary (Dismiss)` and `Primary (Action)` buttons.

---

## 10. Business Profile & Owner Account Management (Stage 5.6 Planned)

The Business Owner has complete self-management of their business identity and owner account within the SaaS portal:

### 10.1 Business Profile Fields
- **Public Business Name** — Name of the business shown on portal header and public booking page.
- **Business Logo / Profile Image** — Uploaded graphic or photo representing the business.
- **Contact Phone** — Business telephone number.
- **Contact Email** — Inbound customer inquiry email.
- **Business Address / Location** — Physical studio, salon, or service location.
- **Business Category** — Industry category (e.g. Hair Salon, Barbershop, Wellness, Tutoring).
- **Currency Symbol** — Currency displayed on service prices (e.g., `$`, `€`, `£`).
- **Business Description / Bio** — Short summary or introduction displayed on the public booking page.

### 10.2 Planned Sub-Stage Deliverables
- **5.6.1 — Business Profile Overview:** Populated overview of current business info, logo/image, location, category, currency, bio, public link summary, and edit trigger. Supports normal, loading, incomplete, and error states.
- **5.6.2 — Edit Business Profile:** Comprehensive editing form with inputs for all profile fields, image upload/change, save changes, cancel/discard, inline validation, saving/loading state, save success feedback, and save failure banner.
- **5.6.3 — Public Booking Link / Profile Settings:** Display of business booking URL (`bookflow.me/b/[slug]`), copy link action, and quick link to preview the public booking page.
- **5.6.4 — Owner Account & Security:** Account email display, password management (current password, new password, confirm new password), validation feedback, and secure session logout.
- **5.6.5 — Profile & Account States / Final Validation:** Verification of loading, incomplete, validation errors, unsaved changes alert, error recovery, responsive behavior, and return navigation.

---

## 11. Public Customer Booking Flow Visual Language

The client booking interface is an accountless, high-clarity linear flow optimized for high conversion and zero friction.

### Flow Architecture (Linear 4-Step Stepper)
```
Step 1: Service Selection  ──►  Step 2: Date & Time Picker  ──►  Step 3: Customer Details  ──►  Step 4: Confirmation
[Transparent Cards]           [Interactive Calendar & Slots]   [Name, Phone, Email]          [Reference & Summary]
```

### UX & Visual Guidelines for Booking
- **Accountless:** No signup, password, or account login is requested or displayed.
- **Service Cards:** Clear cards displaying service name, description, duration in minutes, and price. Selected service receives primary border (`border-2 border-blue-600 bg-blue-50/30`).
- **Date & Slot Selector:**
  - Interactive monthly calendar with disabled past dates and business closed days.
  - Clean grid of available time chips (e.g. `09:00 AM`, `10:15 AM`). Selected slot highlighted in solid blue.
  - Double-booking prevention enforced at the time slot level.
- **Customer Information Form Fields (Strictly Limited to 3 Fields):**
  1. **Full Name** — *Required* (`text` input, required affordance `*`).
  2. **Phone Number** — *Required* (`tel` input, required affordance `*`, helper description: *"Required customer contact information."*).
  3. **Email** — *Optional* (`email` input, optional affordance `(optional)`).
  *(No notes, special requests, address, or other customer-facing booking fields exist in MVTS v1).*
- **Confirmation Screen (Read-Only):**
  - Instant success illustration / badge (`Booking Request Received`).
  - Prominent alphanumeric **Booking Reference Code** (e.g. `#BK-8942`).
  - Clear summary card: Service, Date, Time, Business Name, Location/Contact.
  - Explicit customer reassurance: *"Your booking request has been submitted to the business owner and is awaiting confirmation."*
  - **No calendar export buttons** (no Google Calendar / iCal buttons in MVP v1).
  - **No customer self-reschedule / self-cancel buttons** (customer controls end at confirmation).

---

## 12. Platform Administrator Portal (Stage 7.5 Planned)

The Platform Administrator Portal provides platform-level administrative visibility and monitoring across all registered businesses on BookFlow. It is visually and structurally distinct from the Business Owner portal while adhering to the BookFlow Design System.

### 12.1 Planned Sub-Stage Deliverables
- **7.5.1 — Admin Dashboard:** High-level platform activity overview: Total Registered Businesses, Active Businesses, Total Customers Across Platform, Total Appointments, Recent Platform Activity timeline. (Zero financial BI or predictive models).
- **7.5.2 — Business Management:** Searchable, filterable administrative directory table showing business name, owner name, category, contact info, status, registration date, customer count, and appointment volume. Actions: Search, filter by status/category, open business details.
- **7.5.3 — Business Details:** Administrative inspection view displaying business profile information, owner information (name, email), and platform usage counts (customers, appointments, recent activity). Administrative read/monitoring view; strictly maintains customer privacy boundaries.
- **7.5.4 — Platform Analytics / Usage Overview:** Lightweight platform-level metrics: registered businesses count, customer count, appointment count, and basic volume/registration trends. (Zero revenue/financial analytics).
- **7.5.5 — Admin States & Final Validation:** Verification of admin authentication boundary, loading states, empty search results, error banners, and responsive layouts.

### 12.2 Responsive Administrator Experience
- **Desktop:** Persistent sidebar, top bar, structured content container, wide data tables, and KPI metric cards.
- **Tablet:** Collapsible navigation drawer, 2-column KPI grid, horizontally contained tables with scroll indicators.
- **Mobile:** Top bar with menu trigger, single-column stacks, responsive cards instead of wide tables, touch-friendly 44px+ controls. Standard responsive web page — NOT a native mobile app and NOT an installed PWA.

---

## 13. Authoritative Stage Order & Planned Workflow

The project execution workflow is strictly organized into the following ordered stages:

| Stage | Title | Focus & Core Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Stage 1** | **Product/UI Foundation** | Product specification, architecture boundaries, and user roles. | **FROZEN** |
| **Stage 2** | **Design System / Visual Foundation** | Design tokens, color palette, typography, components, and standards. | **FROZEN** |
| **Stage 3** | **Public Landing Page** | Public marketing page, brand hero, features, and owner CTA entry points. | **FROZEN** |
| **Stage 4** | **Business Owner Authentication** | Business Owner Registration and Business Owner Sign In screens. | **FROZEN** |
| **Stage 5** | **Business Owner Portal** | Dashboard (5.1), Appointments (5.2), Services (5.3), Working Hours (5.4), CRM (5.5). | **FROZEN** |
| **Stage 5.6**| **Business Profile & Owner Account** | Profile Overview (5.6.1), Edit Profile (5.6.2), Public Link / Settings (5.6.3), Owner Account & Security (5.6.4), Profile States & Validation (5.6.5). | **PLANNED** |
| **Stage 6** | **Public Customer Booking** | Link Access (6.1), Services (6.2), Date/Time (6.3), Contact Form (6.4), Review (6.5), Confirmation (6.6), States & Matrix (6.7). | **FROZEN** |
| **Stage 7** | **Responsive Web Variants** | Tablet & Mobile Web responsive refinements across public and portal viewports. | **IN PROGRESS** |
| **Stage 7.5**| **Platform Administrator Portal** | Admin Dashboard (7.5.1), Business Management (7.5.2), Business Details (7.5.3), Platform Analytics / Usage (7.5.4), Admin States & Validation (7.5.5). | **PLANNED** |
| **Stage 8** | **Linking & Prototype Flow** | Holistic click-through routing map, state transitions, and final academic demonstration. | **PLANNED** |

---

## 14. Authoritative MVP Scope Safeguards (Strict Exclusions Preserved)

To maintain absolute integrity with the MVTS v1 specification, the following are strictly prohibited from all UI designs:
- ❌ **No Payment Processing:** No Stripe, PayPal, deposits, payment links, invoices, deposit status pills, or payment confirmation sheets.
- ❌ **No Staff Management:** No multi-staff calendars, employee selection dropdowns, staff filters, staff assignments, or employee accounts.
- ❌ **No Multi-Location Management:** No multiple branches or multi-location switching.
- ❌ **No Customer Self-Service Portals:** No customer accounts, passwords, login links, customer cancellation buttons, customer reschedule workflows, or customer dashboards.
- ❌ **No Calendar Export:** No "Add to Google Calendar", "Apple iCal", or ".ics download" buttons.
- ❌ **No External Third-Party Messaging:** No WhatsApp integration buttons, SMS marketing, or automated external campaign tools.
- ❌ **No AI Receptionists / Chatbots:** No chatbot widgets or AI prompts.
- ❌ **No Installed PWA Features:** No install prompts, offline banners, or push notifications.
- ❌ **No Marketplace Discovery:** No public directory search, consumer reviews, or star ratings.
- ❌ **No Advanced Analytics / BI:** No predictive modeling, financial forecasting, revenue analytics, or customer segmentation.
- ❌ **No Advanced Identity:** No social logins, SSO, MFA setup, or multi-tenant account deletion workflows in v1.

---

## 15. Frozen Foundation Summary

BookFlow MVTS v1 is a modern, responsive web application consisting of three distinct experience areas:
1. **Business Owner Portal** (Authenticated SaaS portal for solo operators)
2. **Public Accountless Customer Booking** (Frictionless guest booking flow)
3. **Platform Administrator Portal** (Dedicated platform-level administration & monitoring)

This document, along with the active **BookFlow Design System** (`{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`), serves as the **Authoritative Foundation — Updated & Frozen (v1.1)**. It governs all visual design, layout, navigation, responsive behavior, accessibility, appointment states, booking flow, role boundaries, business profile management, owner account/security, platform administration, and strict MVP exclusions for all subsequent screen-generation and prototype stages.
