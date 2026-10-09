# BookFlow UI/UX Implementation Guide

## Purpose

This guide turns the frozen BookFlow v1.1 foundation and available Stitch designs into implementation and QA instructions. It does not replace the authoritative foundation.

## Required implementation workflow

1. Inspect the relevant Stitch screen and the screen inventory before coding.
2. Read the matching requirements in the frozen foundation.
3. Implement one screen or tightly scoped screen group at a time.
4. Match tokens and components before adding decorative refinements.
5. Implement loading, empty, error, validation, success, and confirmation states that apply to the screen.
6. Verify desktop, tablet, and mobile in a visible browser.
7. Test interactions, keyboard focus, field validation, navigation, and role boundaries.
8. Capture evidence and record any deviation before closing the phase.

## Source-of-truth hierarchy

1. Frozen BookFlow MVTS v1.1 foundation.
2. This implementation guide and screen-specific approved notes.
3. Existing Stitch visual references.
4. `DESIGN.md` subordinate file where non-conflicting only.
5. Implementer's judgement for unspecified details, documented as an assumption and escalated if it changes product behavior.

## Component implementation standards

- Reuse shared components for buttons, form fields, cards, status badges, navigation, tables, modals, and empty/error states.
- Use design tokens rather than repeating raw color values throughout the UI.
- Use Inter consistently and map typography to the documented roles.
- Maintain a visible keyboard focus indicator.
- Use text plus a distinct icon for appointment status; never rely on color alone.
- Use 44px minimum touch targets on tablet/mobile where the foundation requires them.
- Use tabular numerals for timestamps and numeric counters where appropriate.
- Keep labels programmatically associated with their inputs and communicate required/optional fields.
- Prevent horizontal overflow at responsive widths; tables may be contained in a deliberate scroll region on tablet.
- Use semantic headings and landmarks; maintain sufficient contrast.

## Screen behavior requirements

### Public landing page
- Public navigation only; no authenticated profile/avatar controls.
- CTA destinations must be explicit and correct.
- No feature copy that promises excluded functionality.
- Existing section order should be preserved unless a verified defect is approved for correction.

### Owner portal
- Require authenticated owner access.
- Show only the signed-in owner's business data.
- Appointment actions must follow allowed state transitions and display clear confirmation/error feedback.
- Service active/inactive and availability controls need clear state feedback.
- CRM supports customer details, appointment history, and private owner notes; do not add segmentation features.
- Business profile and account/security screens follow the foundation's planned fields and states.

### Customer booking
- No signup, login, password, customer portal, or customer self-service cancellation/rescheduling.
- Contact fields are exactly Full Name (required), Phone Number (required), and Email (optional).
- Prevent invalid or unavailable time-slot submissions and protect against double booking.
- Include a review step as required by the full flow description.
- Final confirmation is read-only, includes a reference code and appointment summary, and clearly says the request is awaiting owner confirmation with Pending status.
- No calendar export buttons.

### Platform administrator
- Use a distinct `/admin` portal and navigation shell.
- Limit screens to platform dashboard, business directory/details, basic usage, and admin account/security as scoped.
- No payment/financial BI, predictive analytics, staff management, or business-owner booking actions.

## Responsive implementation checklist

### Desktop (1024px+)
- Persistent sidebar for owner/admin areas, 64px top bar, structured content container.
- Keep data-dense views scannable; avoid excessive whitespace that reduces useful table visibility.
- Validate the 12-column grid where applicable.

### Tablet (640px–1024px)
- Collapse sidebar to rail/drawer as appropriate.
- Adapt metric grids to two columns or one column where needed.
- Contain tables and make horizontal scrolling discoverable.
- Ensure controls remain touch-friendly.

### Mobile (<640px)
- Use top bar and slide-over drawer for portal navigation.
- Stack cards, forms, and CTAs in a single column.
- Replace wide tables with responsive cards where appropriate; if a table remains, contain and label scrolling.
- Ensure controls and touch targets are at least 44px.
- No native mobile tab bar or installed-PWA UI.

## State coverage matrix

For each applicable screen, consider:
- Initial/default state
- Loading state
- Empty state
- Error state and recovery
- Validation error state
- Saving/submitting state
- Success state
- Disabled/inactive state
- Confirmation dialog for destructive or consequential actions
- Responsive navigation open/closed
- Permission-denied/unauthenticated state for protected routes

Do not create every state indiscriminately. Record only states relevant to the screen and its actual functionality.

## QA evidence required before closing a phase

- Screenshot of the implemented screen at desktop width.
- Screenshot or visible browser evidence at tablet and mobile widths.
- Evidence of important interaction/state transitions.
- Results of form validation and navigation checks.
- Confirmation that no excluded feature has been introduced.
- List of deviations, unresolved ambiguities, and tests not performed.

Use explicit status labels in the phase report: **Implemented**, **Visually verified**, **Functionally tested**, **Not tested**, or **Blocked**. Do not use “complete” as a substitute for evidence.

## Change control

Small corrections that restore a documented token or requirement may be implemented within the phase. Any substantial layout change, new interaction, altered product behavior, or scope expansion must be reported for owner approval before implementation.
