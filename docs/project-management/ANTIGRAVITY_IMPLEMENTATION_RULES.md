# Antigravity Implementation Rules

This document establishes the permanent implementation rules for all Antigravity sessions working on the BookFlow repository. Adhere to these guidelines strictly to ensure consistency, prevent scope creep, and respect architectural boundaries.

## 1. Source-of-Truth Hierarchy
- **Approved MVTS**: The ultimate source for product requirements and MVP scope.
- **`ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md`**: The frozen source for UI/UX tokens and design rules.
- **`ui-ux/UI_UX_IMPLEMENTATION_GUIDE.md`**: Guidance for implementation and QA.
- **`ui-ux/screens/SCREEN_INVENTORY.md`** & **`ui-ux/flows/USER_FLOWS.md`**: The authoritative screen taxonomy and user journeys.
- **Stitch designs and subordinate design references**: Provide visual references only; they never grant permission to override authoritative requirements.

## 2. Before Implementing Any Task
- Inspect relevant requirements, flows, screen references, and existing code.
- Identify the exact scope and acceptance criteria.
- List affected files and likely dependencies.
- Identify ambiguities before making assumptions.
- Work in a focused feature branch rather than directly on `main`.

## 3. UI Implementation Rules
- Use the approved stack: **Next.js, React, TypeScript, Tailwind CSS, and TanStack Query**.
- Follow frozen colors, typography, spacing, radii, status tokens, and responsive rules.
- Reuse consistent components and patterns.
- Implement loading, empty, error, validation, saving, success, disabled, confirmation, and authorization states where relevant.
- Do not invent new pages or silently alter approved screens.
- Treat prototype content as sample data unless the requirements establish otherwise.

## 4. Product and Security Boundaries
- Preserve strict business data isolation and separate owner/admin authorization.
- Customer booking remains accountless.
- The booking form has only **Full Name (required)**, **Phone Number (required)**, and **Email (optional)**.
- Enforce availability, double-booking prevention, and business rules on the backend.
- Do **not** add payments, invoices, multi-staff scheduling, customer accounts, external messaging, AI widgets, native applications, or installed-PWA features to this MVP.

## 5. Implementation and Testing
- Make focused, incremental changes.
- Add or update tests for changed behavior.
- Run relevant lint, type-check, build, and test commands when configured.
- Never claim a check passed unless it was actually run and its result observed.
- Inspect the final diff and check for unrelated changes and secrets.
- Report changed files, requirements addressed, tests run, results, and remaining issues.

## 6. Change Control
- Do not modify frozen requirements or design foundations without explicit approval.
- Record material architectural decisions.
- Stop and report conflicts instead of silently resolving ambiguous requirements.
