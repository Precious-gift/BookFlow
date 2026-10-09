---
name: BookFlow Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#2c4bb9'
  on-tertiary: '#ffffff'
  tertiary-container: '#4865d4'
  on-tertiary-container: '#eff0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#173bab'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.005em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system is engineered for service-driven operational clarity, calm efficiency, and effortless client conversion. It balances high-density utility for business owners managing schedules and client records with a frictionless, confidence-inspiring booking experience for first-time guests.

### Brand Personality & Emotional Impact
- **Trustworthy & Competent:** Precision-crafted typography, crisp contrast boundaries, and intentional status communication reinforce reliability.
- **Approachable & Streamlined:** Removing visual friction through uncluttered information staging allows service providers and clients to navigate appointments without cognitive overload.
- **Systematic & Productive:** A structured design rhythm anchored in modern software design principles, prioritizing legible data tables, calendar heatmaps, and clear calls to action.

### Design Movement: Modern Corporate Utility
The aesthetic marries clean corporate software standards with soft tactile elements. It avoids unnecessary ornament, leveraging pure white and cool slate surfaces, structural hairline dividers (`#E2E8F0`), and focused, high-contrast action states powered by deep technical blue (`#2563EB`).

## Colors

The palette establishes an immediate sense of operational structure using slate-tinted neutrals, purposeful interaction blues, and immediate semantic states.

### Primary & Accent Roles
- **Primary Indigo (`#2563EB`):** Applied to primary actions, selected dates, active navigation states, and key operational signals.
- **Deep Indigo Hover/Active (`#1E40AF`):** Used for interaction depth, focused outlines, and active tab highlights.
- **Teal Accent (`#0D9488`):** Accents secondary highlights, upsells, new booking badges, and secondary analytical indicators.

### Neutral Foundation (Slate Scale)
- **Background Layer (`#F8FAFC` / `slate-50`):** Base canvas for application frames and guest checkout backdrops.
- **Surface Layer (`#FFFFFF`):** High-clarity cards, calendar cells, tables, and modal dialogs.
- **Subtle Surface (`#F1F5F9` / `slate-100`):** Inactive states, table headers, and form input backgrounds.
- **Border & Hairline (`#E2E8F0` / `slate-200`):** Precise card divisions and form field boundaries.
- **Muted Text / Secondary Labels (`#64748B` / `slate-500`):** Timestamps, metadata, and supporting microcopy.
- **Body Text (`#334155` / `slate-700`):** Standard reading text and interface copy.
- **Headings & High-Emphasis (`#0F172A` / `slate-900`):** Key titles, appointment times, client names, and metric totals.

### Semantic Status Roles
- **Pending (`#F59E0B` Amber):** Unconfirmed requests or pending deposits. Paired with `#FFFBEB` background and `#B45309` text.
- **Confirmed (`#0284C7` Light Blue):** Locked appointments. Paired with `#F0F9FF` background and `#0369A1` text.
- **Completed (`#10B981` Emerald):** Finalized sessions and settled invoices. Paired with `#ECFDF5` background and `#047857` text.
- **Cancelled (`#F43F5E` Rose):** No-shows, cancellations, and declined bookings. Paired with `#FFF1F2` background and `#BE123C` text.

## Typography

The typographic hierarchy is powered entirely by `Inter`, selected for its high x-height, open apertures, and specialized tabular figures that prevent jumpiness across time slots, scheduling grids, and numeric revenue metrics.

### Hierarchy & Usage
- **Display & Large Headlines:** Used exclusively for high-impact stats, landing headers, and main modal titles. Always set with tight negative tracking (`-0.02em` to `-0.025em`).
- **Mid & Small Headlines:** Anchor dashboard widget cards, CRM timeline groupings, and section headers in the booking step-flow.
- **Body Styles:** Body Medium (`0.875rem` / `14px`) serves as the core utility text for CRM customer notes, appointment descriptions, and input field values.
- **Labels & Microcopy:** Label styles are set with medium or semi-bold weights for badge counters, navigation labels, and uppercase table column headers. Tabular figures (`tnum`) must be enabled on all scheduling timestamps and monetary counters.

## Layout & Spacing

The layout is built on a rigid 8pt spatial grid (with a 4pt micro-increment for tight button and chip padding).

### Layout Modes
- **SaaS Dashboard Layout:** Utilizes a persistent left-hand navigation sidebar (width: `256px` desktop, collapsible to `64px` icon-only or hidden on mobile drawers), a sticky top command bar (`64px` height), and a fluid 12-column responsive grid workspace with max content bounds capped at `1440px`.
- **Guest Booking Flow:** A centered single-column layout or split two-column card layout (left column: service details and summary; right column: interactive calendar and time selection). Capped at a max-width of `896px` (`56rem`) to maintain focus and prevent abandonment.

### Responsive Breakpoints
- **Mobile (< 640px):** Single-column layout. Navigation shifts to bottom sheets or a top slide-out drawer. Calendars switch to horizontal day-strip selector mode.
- **Tablet (640px - 1024px):** 6-column fluid grid. Collapsible navigation bar. Stacked card groups for client overviews.
- **Desktop (> 1024px):** 12-column fluid grid with standard `1.5rem` gutters and `2rem` screen margins. Full monthly/weekly multi-staff calendar views activate.

## Elevation & Depth

Visual hierarchy uses clean structural boundaries supported by soft, non-directional ambient shadows tinted with slate.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC`. Zero elevation. Used for dashboard backdrops and booking flow canvas.
- **Level 1 (Card & In-Flow Surfaces):** Surface color `#FFFFFF` with a crisp `1px` border in `#E2E8F0` and shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`. Used for calendar cells, client list cards, and summary panels.
- **Level 2 (Hover States & Flyouts):** `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`. Used for interactive time slot chips, active booking cards, and contextual action menus.
- **Level 3 (Modals & Overlays):** `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)` accompanied by a backdrop scrim (`#0F172A` at `40%` opacity). Used for appointment details drawers, rescheduling dialogs, and payment confirmation sheets.

## Shapes

The design system uses a roundedness level of 2, imparting a soft, approachable, yet firmly structured feel suitable for modern productivity software.

### Geometry Standards
- **Small Controls (`0.5rem` / `8px`):** Applied to form inputs, buttons, filter dropdowns, badges, and time slot selections.
- **Containers & Surfaces (`1rem` / `16px`):** Applied to dashboard metric cards, appointment summary panels, and data table wrappers.
- **Large Panels & Modals (`1.5rem` / `24px`):** Applied to main booking containers, floating checkout sheets, and full calendar dialogs.
- **Strict Circles (`9999px`):** Reserved exclusively for user avatars, step progress markers, and icon buttons.

## Components

### Buttons
- **Primary:** Solid `#2563EB` background with white text, font weight `500`, height `40px` (`space-md` horizontal padding), border radius `0.5rem`. Hover state: `#1E40AF`. Active focus ring: `2px` offset with `#2563EB`.
- **Secondary / Outline:** White surface, border `1px solid #E2E8F0`, text `#334155`. Hover state: `#F8FAFC` background with border `#CBD5E1`.
- **Destructive:** Borderless or ghost `#F43F5E` text with `#FFF1F2` background on hover. Used for appointment cancellation.

### Input Fields & Selects
- Height `40px`, border `1px solid #E2E8F0`, background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`.
- Focus state transition: border color `#2563EB`, paired with a `0 0 0 3px rgba(37, 99, 235, 0.15)` focus ring.
- Labels sit above inputs using `label-sm` in `#334155` with a `4px` gap.

### Chips & Time Slot Pickers
- **Available Time Slot:** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#334155`, font weight `500`. Hover brings border `#2563EB` and text `#2563EB`.
- **Selected Time Slot:** Background `#2563EB`, text `#FFFFFF`, border `1px solid #2563EB`.
- **Status Chips:** Height `24px`, padding `2px 8px`, border radius `0.375rem`. Text is `0.75rem` with font weight `600`.
  - *Pending:* `#FFFBEB` background, `#B45309` text.
  - *Confirmed:* `#F0F9FF` background, `#0369A1` text.
  - *Completed:* `#ECFDF5` background, `#047857` text.
  - *Cancelled:* `#FFF1F2` background, `#BE123C` text.

### Cards & Calendar Grid Cells
- Base card wraps with white background, border `1px solid #E2E8F0`, padding `1.5rem`, border radius `1rem`.
- Calendar time grid features `1px solid #F1F5F9` row dividers. Appointment blocks nested inside calendar grids use status background colors with a solid left accent border (`3px solid`).

### Lists & Tables (CRM View)
- Table headers: `#F8FAFC` background, text `label-sm` uppercase `#64748B`, tracking `0.05em`, border bottom `1px solid #E2E8F0`.
- Rows: Height `56px`, hover state `#F8FAFC`, transition `150ms ease`. Border bottom `1px solid #F1F5F9`.

### Checkboxes & Radios
- Size `18px x 18px`, border `1.5px solid #CBD5E1`, border radius `4px` for checkboxes and `9999px` for radios.
- Checked state: background `#2563EB`, border color `#2563EB`, displaying a white check icon or center dot.