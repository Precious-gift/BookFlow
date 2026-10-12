# BookFlow MVP Agile Backlog

This directory maintains the authoritative, vendor-neutral backlog specifications for the BookFlow MVP implementation.

---

## 1. Operational Agile Board

- **Public Trello Board:** [BookFlow — MVP Implementation](https://trello.com/b/3BOlXBHK/bookflow-mvp-implementation)
- **Workflow State Columns:** `Backlog` → `Ready` → `In Progress` → `Review` → `Done` (plus `Blocked`).
- **Initial Card Placement:** All 56 tickets (`[T-01]` through `[T-56]`) are established as first-class cards initially positioned in `Backlog` in strict topological dependency order.
- **Card Contents:** Every card includes the 6-level hierarchy breadcrumb, objective, scope (inclusions/exclusions), frontend/backend/API requirements, blocking prerequisites, satisfied planning decisions, UI references, and an interactive **Acceptance Criteria Checklist**.

---

## 2. Backlog Hierarchy Architecture

The logical backlog hierarchy model is strictly defined as:
`MVP (1)` → `Epics (10)` → `Features (32)` → `Stages (37)` → `Sub-stages (56)` → `Tickets (56)`

### Epics Summary
- **Epic 1 (`T-01` – `T-06`):** Architecture, Infrastructure & Solution Foundation
- **Epic 2 (`T-07` – `T-10`):** Identity, Authentication & Security Governance
- **Epic 3 (`T-11` – `T-17`):** Business Onboarding, Service Catalog & Profile Management
- **Epic 4 (`T-18` – `T-24`):** Working Schedules, Operating Shifts & Availability Management
- **Epic 5 (`T-25` – `T-31`):** Public Guest Booking Engine & Stepper Flow
- **Epic 6 (`T-32` – `T-38`):** Owner Appointment Lifecycle & Operational Rescheduling
- **Epic 7 (`T-39` – `T-43`):** Single-Operator Customer Directory & Lightweight CRM
- **Epic 8 (`T-44` – `T-47`):** Business Owner Operations Dashboard & Activity Metrics
- **Epic 9 (`T-48` – `T-52`):** Platform Administration Portal & Global Governance
- **Epic 10 (`T-53` – `T-56`):** Cross-Cutting Quality Assurance & End-to-End Verification Gate

---

## 3. Approved Planning Decisions (`D-01` to `D-07`)

The seven Product-Owner planning decisions approved during Phase 7.1.3 are **satisfied planning prerequisites**, not blocking ticket dependencies:

| Decision ID | Topic | Approved Rationale | Governing Tickets |
| :--- | :--- | :--- | :--- |
| **D-01** | Session Persistence | 14-day sliding expiration persistent cookie (`IsPersistent = true`). | `T-09`, `T-12`, `T-55` |
| **D-02** | Security Stamp Interval | 5-minute security-stamp validation interval (`TimeSpan.FromMinutes(5)`). | `T-09`, `T-19`, `T-55` |
| **D-03** | String Constraints | Maximum bounds: `Business.Name` (100), `Business.Slug` (100), `ApplicationUser.Email` (256). | `T-02`, `T-03`, `T-08`, `T-10`, `T-17`, `T-18`, `T-55` |
| **D-04** | Booking Stepper | 5 explicitly numbered physical steps matching frozen screens (`CUS-01` through `CUS-05`). | `T-29`, `T-31`, `T-33`, `T-34`, `T-56` |
| **D-05** | Dashboard Metric | Count all future appointments with `Pending` or `Confirmed` status indefinitely. | `T-45`, `T-46`, `T-54`, `T-56` |
| **D-06** | Inactive Business Policy | API boundary enforcement returning HTTP 403 Problem Details (no new banner screens). | `T-16`, `T-18`, `T-21`, `T-25`, `T-38`, `T-40`, `T-44`, `T-55` |
| **D-07** | Performance Benchmark | 20 virtual users, seeded database, p95 response time < 2.0s under defined workload. | `T-56` |

---

## 4. Ticket Dependency Rules

1. **Strict Ticket Prerequisite Boundaries:** Blocking dependencies strictly reference other implementation tickets (`T-XX`). Decisions `D-01` through `D-07` are never treated as blocking runtime tickets.
2. **Topological Order & Acyclicity:** The 56-ticket dependency directed acyclic graph (DAG) contains zero circular dependencies. Tickets enter the `Ready` column only when all upstream prerequisites have reached `Done`.
3. **Key Reconciled Mappings:**
   - `T-05` (Rate Limiting & Payload Size Enforcement): Depends solely on `T-04`.
   - `T-12` (Business Onboarding & Provisioning Handler): Depends on `T-07` and `T-09`.
   - `T-45` (Dashboard Query Handler & Calculations): Depends on `T-03`, `T-15`, and `T-16`.

---

## 5. Artifact Directory Inventory

- [`backlog_manifest.json`](./backlog_manifest.json): Canonical machine-readable JSON backlog dataset (56 tickets with complete metadata, scopes, acceptance criteria, and dependency arrays).
- [`BOOKFLOW_MVP_BACKLOG_PACKAGE_v1.0.md`](./BOOKFLOW_MVP_BACKLOG_PACKAGE_v1.0.md): Full narrative governance specification detailing the hierarchy tree, ticket contracts, and acceptance benchmarks.
