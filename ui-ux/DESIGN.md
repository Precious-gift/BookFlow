# BookFlow Design Documentation

**Status:** Implementation handoff — Design Freeze v1  
**Authoritative product/design specification:** `design-system/AUTHORITATIVE_FOUNDATION_v1.1.md`  
**Supporting reference:** `design-system/DESIGN_SYSTEM_REFERENCE_SUBORDINATE.md`

## Source-of-truth hierarchy

1. The frozen BookFlow MVTS v1.1 foundation is authoritative for product scope, actors, authorization boundaries, colors, typography, spacing, components, status semantics, responsive requirements, and exclusions.
2. `DESIGN.md` from the previous design workflow is retained for traceability only. If it conflicts with the frozen foundation, follow the frozen foundation.
3. Existing Google Stitch screens are visual references, not permission to violate product requirements.
4. This document records implementation guidance and must not silently amend the frozen foundation. Raise conflicts for approval.

## Brand and visual direction

BookFlow is a trustworthy, calm, uncluttered, modern desktop-first responsive web application for independent single-operator service businesses. Prioritize scannability, clear appointment states, readable data, restrained blue accents, and consistent controls.

## Color tokens

| Token | Value | Use |
|---|---|---|
| Primary | `#2563EB` | Primary buttons, selected dates, active navigation, key links/focus |
| Primary hover | `#1D4ED8` | Primary interactive hover |
| Primary subtle | `#EFF6FF` | Selected rows and light primary tint |
| Secondary accent | `#0D9488` | Supporting accents only |
| Secondary hover | `#0F766E` | Secondary accent hover |
| Background | `#F8FAFC` | Global application canvas |
| Surface | `#FFFFFF` | Cards, modals, tables, navigation containers |
| Surface secondary | `#F1F5F9` | Table headers, secondary button backgrounds, disabled inputs |
| Surface tertiary | `#E2E8F0` | Dividers and separators |
| Border | `#E2E8F0` | Default card/input/row borders |
| Border hover | `#CBD5E1` | Hover borders |
| Border focus | `#2563EB` | Keyboard focus border |
| Primary text | `#0F172A` | Headings, important values, active labels |
| Secondary text | `#475569` | Body copy and supporting descriptions |
| Muted text | `#94A3B8` | Helper text, placeholders, inactive icons |

Use the exact semantic appointment status tokens in the authoritative foundation §6. Do not use colors alone to convey status.

## Typography

Use **Inter** throughout. Apply roles from the foundation §7:

| Role | Size / line height | Weight | Typical use |
|---|---:|---:|---|
| Display / Hero | 32px / 38px | 600 | Public booking business-name hero, auth landing |
| Page heading | 24px / 32px | 600 | Owner/admin page titles |
| Section heading | 18px / 26px | 600 | Card cluster titles, modal/table headings |
| Card heading | 16px / 24px | 500 | Metric labels, service titles |
| Metric value | 28px / 34px | 700 | KPI values |
| Body primary | 14px / 20px | 400 | Standard data, descriptions, form inputs |
| Body secondary | 13px / 18px | 400 | Helper text and timestamps |
| Label / caption | 12px / 16px | 500 | Form labels, status tags, compact headers |
| Button text | 14px / 20px | 500 | Interactive buttons |

Do not import the larger typography scale from the subordinate design-system file where it conflicts with this table. If the team later wants a marketing-specific exception, record and approve a foundation amendment rather than silently diverging.

## Spacing and geometry

Use the foundation's 8-point rhythm with its documented 4px micro-spacing:
- 4px for micro gaps, such as icon-to-text.
- 8px for compact internal spacing.
- 12px for compact control/table spacing.
- 16px for standard card/form spacing.
- 24px for card margins, dashboard gaps, and modal padding.
- 32px for larger section spacing.
- 40px standard input/button height per component specifications.
- 48px and 64px for larger section breathing room.

Radius tokens:
- 4px (`rounded-sm`): status tags and micro badges.
- 6px (`rounded-md`): form controls, dropdowns, secondary buttons.
- 8px (`rounded-lg`): standard cards, primary buttons, modals, calendar tiles.
- 12px (`rounded-xl`): metric cards and guest booking container.
- Full: pills and avatar circles.

## Core components

### Buttons
- Primary: blue fill, white text, 40px nominal control height, 8px radius, visible keyboard focus.
- Secondary: white surface, slate border and text.
- Ghost/tertiary: low-emphasis text action with hover surface.
- Destructive: clear cancellation/deactivation treatment; do not use as the default action.

### Form controls
- Text/phone/email/number input height: 40px.
- Labels above controls, explicit required marker, and `(optional)` for optional fields.
- Validation errors immediately below the relevant field.
- Focus border and ring must be visible.
- Customer booking form is strictly limited to Full Name (required), Phone Number (required), Email (optional).

### Cards, tables, dialogs
- Standard cards use white surface, 1px slate border and 8px radius.
- Metric cards use the documented metric layout and 12px radius.
- Desktop tables use clear headers, row dividers, hover affordance, and right-aligned actions.
- Dialogs need a clear title, close/dismiss affordance, and action hierarchy.

### Appointment status badges
- Pending: amber text/background/border and clock/dot indicator.
- Confirmed: `#0369A1` text, `#E0F2FE` background, `#BAE6FD` border; checkmark.
- Completed: `#047857` text, `#D1FAE5` background, `#A7F3D0` border; solid circle-check.
- Cancelled: rose text/background/border and cross/slash indicator.
- Every status uses a visible text label plus a distinct icon; maintain the foundation's 4.5:1 contrast rule.

## Layout rules

### Public landing page
Preserve the existing Stitch section order and content structure unless a verified scope or usability defect requires a correction. The current exported reference is `screens/exports/public-landing-page-desktop.png`.

### Business owner portal
Desktop-first SaaS shell: 256px persistent sidebar, 64px top bar, fluid workspace, content width capped as specified by the foundation. Keep appointments, services, availability, CRM, business profile/settings, and account/security distinct.

### Public customer booking
Accountless linear flow: service selection → date/time → customer details → review → request received/confirmation. Confirmation is read-only and explicitly says the request is awaiting owner confirmation and has Pending status.

### Platform administrator
Dedicated `/admin` shell, distinct from the owner portal. Admin can inspect platform-level business records and aggregate usage, but must not act as a business owner or modify customer bookings through the customer flow.

## Responsive rules

- Desktop: 1024px and above; persistent owner/admin sidebar, 12-column fluid grid where appropriate.
- Tablet: 640px–1024px; collapsible navigation, adaptable KPI grids, contained tables with scroll indicators.
- Mobile: below 640px; top bar with slide-over drawer, single-column stacks, responsive cards instead of wide tables, touch targets at least 44px.
- Do not use native-app bottom navigation, native OS chrome, installed-PWA UI, install prompts, offline banners, or push notification prompts.
- The supplied landing-page image is desktop evidence only. Tablet/mobile designs must be implemented and verified; do not mark them as visually approved until captured and reviewed.

## Navigation and authorization rules

- Public: Landing, Features, How It Works, For Businesses, Sign In, Get Started.
- Owner: authenticated `/portal`; owner data is strictly partitioned to the owner's own business.
- Customer: accountless public booking route `/b/[slug]`; no customer account or portal.
- Admin: separate authenticated `/admin` portal; no owner operations.
- Protected destinations require authentication/authorization. Do not infer a destination's security from its label alone.

## Strict MVP exclusions

No payment processing, deposits, invoices, staff management, multiple locations, customer accounts, customer self-cancellation/rescheduling, calendar export, third-party messaging, AI receptionist/chatbot, installed PWA features, marketplace discovery, advanced analytics/BI, predictive analytics, or customer segmentation.

## Known ambiguities and handoff controls

1. The foundation's §4 describes service selection, date/time, customer information, review, and confirmation; §11 calls the flow a four-step stepper but its diagram omits Review. Preserve the full required journey and ask the product owner to settle stepper count before changing it.
2. The screenshot export available in this handoff is the desktop public landing page. Other screens and responsive variants are not falsely represented as exported.
3. `DESIGN.md` conflicts with the frozen foundation in palette, typography, radii, and some out-of-scope examples. Frozen foundation wins.
