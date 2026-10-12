# BookFlow MVP Agile Implementation Backlog Package (v1.0 Final)

**Document Status:** Final Candidate Backlog — Approved Planning Decisions Incorporated
**Date:** 2026-10-11
**Project:** BookFlow
**YouGile Target:** Project `BookFlow`, Board `BookFlow — MVP Implementation`
**Hierarchy Model:** MVP (1) → Epics (10) → Features (32) → Stages (37) → Sub-stages (56) → Tickets (56)

---

## 1. Approved Decisions Register (D-01 to D-07)

This section formally records the seven Product-Owner planning decisions approved during Phase 7.1.3, specifying their technical implications, governing backlog tickets, and mandatory implementation verification requirements.

| Decision ID | Subject & Scope | Approved Planning Decision | Technical Implications & Constraints | Governing Tickets | Implementation Verification Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Authentication Session Persistence & Expiry** | Persistent cookie (`IsPersistent = true`) with a 14-day sliding expiration. | - ASP.NET Core Identity cookie configured with `ExpireTimeSpan = TimeSpan.FromDays(14)` and `SlidingExpiration = true`.<br>- Written to browser persistent storage.<br>- `HttpOnly = true`, `Secure = true` (in production), `SameSite = Lax`. | `T-09`, `T-12`, `T-55` | Test in `T-55` proving cookie persistence across browser process restarts, sliding extension on active requests, and separate evaluation of absolute lifetime limits. |
| **D-02** | **Identity Security-Stamp Validation Interval** | 5-minute security-stamp validation interval (`TimeSpan.FromMinutes(5)`). | - Configured in `SecurityStampValidatorOptions.ValidationInterval`.<br>- Password change or credential update refreshes stamp in SQL Server.<br>- Secondary active sessions are invalidated upon their next validation cycle (within 5 minutes). | `T-09`, `T-19`, `T-55` | Test in `T-55` simulating two concurrent sessions: session A changes password; assert session B is rejected with HTTP 401 on its next request after the 5-minute threshold. |
| **D-03** | **String Constraints & Schema Alignment** | Maximum string bounds approved:<br>- `Business.Name`: 100 chars<br>- `Business.Slug`: 100 chars (`^[a-z0-9]+(-[a-z0-9]+)*$`)<br>- `ApplicationUser.Email`: 256 chars | - Enforced consistently across EF Core ModelBuilder (`HasMaxLength`), SQL Server DDL (`NVARCHAR`), Identity configuration, and FluentValidation/API validation attributes.<br>- Unaligned truncations prohibited. | `T-02`, `T-03`, `T-08`, `T-10`, `T-17`, `T-18`, `T-55` | Model validation tests in `T-55` verifying that strings exceeding maximum bounds return HTTP 400 Problem Details with camelCase keys; integration test verifying EF Core schema match. |
| **D-04** | **Public Booking Stepper Representation** | 5 explicitly numbered stages matching the 5 physical screens:<br>1. Services<br>2. Date & Time<br>3. Customer Details<br>4. Review<br>5. Confirmation | - Resolves Foundation §11 diagram ambiguity.<br>- Stepper header displays 5 numbered circular step indicators.<br>- Review step (`CUS-04`) retained as an explicit numbered step before final confirmation (`CUS-05`).<br>- Zero alteration to frozen tokens or palettes. | `T-29`, `T-31`, `T-33`, `T-34`, `T-56` | Playwright E2E tests in `T-56` verifying sequential step progression from 1 through 5, step numbering labels, and backwards editing shortcuts from Step 4. |
| **D-05** | **Dashboard Upcoming Appointments Metric** | Count all future appointments with `Pending` or `Confirmed` status indefinitely (no arbitrary 7/30-day window). | - Evaluates `StartTimeUtc > DateTime.UtcNow`.<br>- Filter: `Status IN ('Pending', 'Confirmed')`.<br>- Cancelled and Completed appointments strictly excluded.<br>- Local business calendar dates apply strictly to `todayAppointments`, not `upcomingAppointments`. | `T-45`, `T-46`, `T-54`, `T-56` | Unit & integration tests in `T-54`/`T-56` verifying query predicate accuracy against seeded appointments with future vs past timestamps and various statuses. |
| **D-06** | **Inactive-Business Notification Policy** | No new persistent banner or new screen in MVP. Enforce strictly at API boundary (HTTP 403 Problem Details). | - Backend `BusinessActivationFilter` authoritatively checks database `IsActive` on mutations.<br>- Prohibited owner mutations return HTTP 403.<br>- Existing frontend API error handling displays toast/banner upon 403 response.<br>- Read-only historical access preserved. | `T-16`, `T-18`, `T-21`, `T-25`, `T-38`, `T-40`, `T-44`, `T-55` | Integration test in `T-55` deactivating a business and verifying immediate HTTP 403 on service/availability/appointment mutations; E2E test verifying UI error banner display. |
| **D-07** | **NFR-03 Performance Acceptance Benchmark** | Benchmark acceptance condition: 20 concurrent virtual users, representative query mix against seeded DB, p95 < 2.0s. | - Representative mix: Public availability (40%), Appointment list (30%), Dashboard metrics (20%), Customer directory (10%).<br>- Seeded test data: 50 businesses, 500 services, 5,000 appointments, 2,000 customers.<br>- Warm-up: 30s; Test duration: 60s.<br>- Local test harness against SQL Server. | `T-56` | Automated benchmark test execution in `T-56` using k6 or .NET benchmark harness; outputs latency distribution and asserts p95 latency < 2000ms. |

---

## 2. Final Hierarchy Summary

- **Total MVP:** 1 (`BookFlow`)
- **Total Epics:** 10
- **Total Features:** 32
- **Total Stages:** 37
- **Total Sub-stages:** 56
- **Total Tickets:** 56

### Hierarchy Tree

```
BookFlow MVP Implementation
├── Epic 1: Architecture, Infrastructure & Solution Foundation
│   ├── Feature 1.1: Solution Scaffolding & Repository Structure
│   │   └── Stage 1.1.1: Solution Architecture Setup
│   │       └── Sub-stage 1.1.1.1: Backend Clean Architecture Solution Initialization [T-01]
│   ├── Feature 1.2: Relational Data Model & EF Core Infrastructure
│   │   └── Stage 1.2.1: Database Context & Schema Configuration
│   │       ├── Sub-stage 1.2.1.1: Core Domain Entities & EF Core Model Configuration [T-02]
│   │       └── Sub-stage 1.2.1.2: Relational Constraints, Composite Keys & Initial Migration [T-03]
│   ├── Feature 1.3: Web API Pipeline, Common Infrastructure & Error Handling
│   │   └── Stage 1.3.1: API Pipeline & Security Middleware Setup
│   │       ├── Sub-stage 1.3.1.1: Middleware Pipeline, RFC 7807 & Global Exception Handling [T-04]
│   │       └── Sub-stage 1.3.1.2: Rate Limiting Middleware & Payload Size Enforcement [T-05]
│   └── Feature 1.4: Frontend Application Scaffolding & Design System Infrastructure
│       └── Stage 1.4.1: Next.js Foundation & Design System Setup
│           ├── Sub-stage 1.4.1.1: Next.js App Router Initialization & Tailwind Design Token Setup [T-06]
│           └── Sub-stage 1.4.1.2: Shared Core UI Component Library & Route Groups Layouts [T-07]
├── Epic 2: Identity, Authentication & Security Governance
│   ├── Feature 2.1: ASP.NET Core Identity & Session Management
│   │   └── Stage 2.1.1: Identity Implementation & Authentication Endpoints
│   │       ├── Sub-stage 2.1.1.1: Identity User Setup & Registration Workflow [T-08]
│   │       └── Sub-stage 2.1.1.2: Session Login, Logout & Password Change Endpoints [T-09]
│   ├── Feature 2.2: Authentication & Account Frontend Screens
│   │   └── Stage 2.2.1: Owner Registration & Shared Authentication UI
│   │       ├── Sub-stage 2.2.1.1: Business Owner Registration Screen UI (AUTH-01) [T-10]
│   │       └── Sub-stage 2.2.1.2: Shared Sign-In Screen UI (AUTH-02) & Role Routing [T-11]
│   ├── Feature 2.3: CSRF Protection & Next.js BFF Proxy Integration
│   │   └── Stage 2.3.1: Proxy & Antiforgery Integration
│   │       ├── Sub-stage 2.3.1.1: Next.js Rewrites API Proxy & Cookie Forwarding Setup [T-12]
│   │       └── Sub-stage 2.3.1.2: Antiforgery Token Issuance & Synchronizer Validation [T-13]
│   ├── Feature 2.4: Initial Platform Administrator Provisioning
│   │   └── Stage 2.4.1: Startup Administrator Seeding
│   │       └── Sub-stage 2.4.1.1: Secure Identity Role & Admin User Startup Provisioning [T-14]
│   └── Feature 2.5: Tenant Isolation & Dynamic Business Activation Enforcement
│       └── Stage 2.5.1: Tenant Authorization & Activation Policies
│           ├── Sub-stage 2.5.1.1: Claims-Based Tenant Scoping & Isolation Filter [T-15]
│           └── Sub-stage 2.5.1.2: Authoritative Database Business Activation Evaluation [T-16]
├── Epic 3: Business Profile & Service Catalog Management
│   ├── Feature 3.1: Business Profile Management
│   │   └── Stage 3.1.1: Business Profile API & Owner Management UI
│   │       ├── Sub-stage 3.1.1.1: Business Profile Read & Update API Contracts [T-17]
│   │       └── Sub-stage 3.1.1.2: Owner Business Profile Overview, Edit & Link UI (OWN-06, 07, 08) [T-18]
│   ├── Feature 3.2: Owner Account & Security Settings UI
│   │   └── Stage 3.2.1: Owner Account & Security UI (OWN-09)
│   │       └── Sub-stage 3.2.1.1: Owner Account Overview, Password Change & Logout UI [T-19]
│   └── Feature 3.3: Service Catalog & Lifecycle Management
│       ├── Stage 3.3.1: Service CRUD & Soft-Deactivation API
│       │   └── Sub-stage 3.3.1.1: Service Catalog Persistence & Endpoints [T-20]
│       └── Stage 3.3.2: Service Management Owner UI (OWN-03)
│           └── Sub-stage 3.3.2.1: Owner Service Catalog Management Interface [T-21]
├── Epic 4: Availability Engine & Operational Hours
│   ├── Feature 4.1: Working Hours & Shift Management
│   │   └── Stage 4.1.1: Recurring Shift Management
│   │       └── Sub-stage 4.1.1.1: Working Period Split-Shift Configuration [T-22]
│   ├── Feature 4.2: Blocked / Unavailable Periods Management
│   │   └── Stage 4.2.1: Blocked Date & Time Ranges
│   │       └── Sub-stage 4.2.1.1: Unavailable Period Time Block Management [T-23]
│   └── Feature 4.3: Schedule Concurrency & Atomic Replacement Engine
│       ├── Stage 4.3.1: Availability Aggregate API & Concurrency Control
│       │   └── Sub-stage 4.3.1.1: Availability Aggregate Replacement API & RowVersion Protection [T-24]
│       └── Stage 4.3.2: Owner Availability Configuration UI (OWN-04)
│           └── Sub-stage 4.3.2.1: Owner Working Hours & Availability Interface [T-25]
├── Epic 5: Public Guest Booking Experience
│   ├── Feature 5.1: Public Landing Page & Routing Shell (PUB-01)
│   │   └── Stage 5.1.1: Public Landing Page & Marketing Portal
│   │       └── Sub-stage 5.1.1.1: Public Marketing Landing Page Implementation [T-26]
│   ├── Feature 5.2: Public Service Selection & Time-Slot Generation Engine
│   │   ├── Stage 5.2.1: Public Availability Engine
│   │   │   ├── Sub-stage 5.2.1.1: Public Profile & Active Services Endpoints [T-27]
│   │   │   └── Sub-stage 5.2.1.2: Dynamic Bookable Time-Slot Calculation Engine [T-28]
│   │   └── Stage 5.2.2: Public Service Selection & Date/Time Picker UI (CUS-01, CUS-02)
│   │       └── Sub-stage 5.2.2.1: Public Service Selection & Date/Time Picker UI [T-29]
│   ├── Feature 5.3: Accountless Customer Intake & Data Normalization (CUS-03)
│   │   └── Stage 5.3.1: Customer Intake Validation & Phone Normalization
│   │       ├── Sub-stage 5.3.1.1: Phone Normalization Engine & CRM Entity Association [T-30]
│   │       └── Sub-stage 5.3.1.2: Guest Customer Information Intake Form UI [T-31]
│   ├── Feature 5.4: Booking Transaction Engine & Concurrency Control
│   │   └── Stage 5.4.1: Serializable Booking Transaction API
│   │       └── Sub-stage 5.4.1.1: Serializable Booking Creation & Deadlock Retry Engine [T-32]
│   └── Feature 5.5: Booking Review & Confirmation Presentation (CUS-04, CUS-05)
│       ├── Stage 5.5.1: Public Booking Review Step UI (CUS-04)
│       │   └── Sub-stage 5.5.1.1: Public Booking Review Step UI [T-33]
│       └── Stage 5.5.2: Read-Only Confirmation Presentation UI (CUS-05)
│           └── Sub-stage 5.5.2.1: Read-Only Booking Confirmation Presentation UI [T-34]
├── Epic 6: Owner Appointment Operations
│   ├── Feature 6.1: Appointment Directory & Calendar Agenda (OWN-02)
│   │   └── Stage 6.1.1: Appointment Listing API & Owner Agenda UI
│   │       ├── Sub-stage 6.1.1.1: Appointment Query API with Temporal Filtering [T-35]
│   │       └── Sub-stage 6.1.1.2: Owner Appointment Directory & Agenda View UI [T-36]
│   ├── Feature 6.2: Appointment Details & Lifecycle State Transitions
│   │   └── Stage 6.2.1: Appointment State Machine & ETag Concurrency
│   │       ├── Sub-stage 6.2.1.1: Appointment Details & Status Transition API [T-37]
│   │       └── Sub-stage 6.2.1.2: Owner Appointment Details Drawer & Status Transition Actions [T-38]
│   └── Feature 6.3: Appointment Rescheduling Engine
│       └── Stage 6.3.1: Reschedule API & Modal Workflow
│           ├── Sub-stage 6.3.1.1: Appointment Rescheduling Transaction API [T-39]
│           └── Sub-stage 6.3.1.2: Owner Appointment Reschedule Modal UI [T-40]
├── Epic 7: Customer Relationship Management (CRM)
│   ├── Feature 7.1: Customer CRM Directory & Automatic Matching (OWN-05)
│   │   └── Stage 7.1.1: CRM Directory API & Customer List UI
│   │       ├── Sub-stage 7.1.1.1: Customer Directory Query API [T-41]
│   │       └── Sub-stage 7.1.1.2: Owner CRM Directory Interface UI [T-42]
│   └── Feature 7.2: Customer Profile, Historical Dossier & Internal Notes
│       └── Stage 7.2.1: Customer Profile & Notes Management
│           ├── Sub-stage 7.2.1.1: Customer Profile Details, History & Notes API [T-43]
│           └── Sub-stage 7.2.1.2: Owner Customer Dossier & Private Notes UI [T-44]
├── Epic 8: Analytics & Operational Dashboards
│   ├── Feature 8.1: Business Owner Executive Dashboard (OWN-01)
│   │   └── Stage 8.1.1: Owner Metrics API & Dashboard UI
│   │       ├── Sub-stage 8.1.1.1: Owner Operational Metrics Calculation API [T-45]
│   │       └── Sub-stage 8.1.1.2: Owner Executive Dashboard Interface UI [T-46]
│   └── Feature 8.2: Platform Administrator Metrics & Usage Overview (ADM-01, ADM-04)
│       └── Stage 8.2.1: Platform Metrics API & Admin Overview UI
│           ├── Sub-stage 8.2.1.1: Platform Aggregate Metrics API [T-47]
│           └── Sub-stage 8.2.1.2: Platform Admin Dashboard & Analytics UI [T-48]
├── Epic 9: Platform Administration & Multi-Business Governance
│   ├── Feature 9.1: Platform Administrator Shell & Business Directory (ADM-02, ADM-05)
│   │   ├── Stage 9.1.1: Admin Navigation & Business Directory
│   │   │   ├── Sub-stage 9.1.1.1: Admin Business Directory Query API [T-49]
│   │   │   └── Sub-stage 9.1.1.2: Platform Admin Portal Shell & Business Directory UI [T-50]
│   │   └── Stage 9.1.2: Admin Account & Security Settings UI (ADM-05)
│   │       └── Sub-stage 9.1.2.1: Admin Account & Security UI [T-51]
│   └── Feature 9.2: Administrative Business Inspection & Account Status Control (ADM-03)
│       └── Stage 9.2.1: Business Details & Status Management
│           ├── Sub-stage 9.2.1.1: Admin Business Details & Activation API [T-52]
│           └── Sub-stage 9.2.1.2: Admin Business Inspection & Status Control UI [T-53]
└── Epic 10: System-Wide Integration, Verification & Release Readiness
    ├── Feature 10.1: Concurrency, Deadlock & Stress Verification Suite
    │   └── Stage 10.1.1: Concurrency & Integrity Integration Tests
    │       └── Sub-stage 10.1.1.1: Automated SQL Server Concurrency Verification [T-54]
    ├── Feature 10.2: Security, Isolation & Proxy Verification Suite
    │   └── Stage 10.2.1: Security & Boundary Verification Tests
    │       └── Sub-stage 10.2.1.1: Automated Tenant Isolation & Proxy Security Verification [T-55]
    └── Feature 10.3: End-to-End User Journey & Build Acceptance Verification
        └── Stage 10.3.1: End-to-End Verification & Build Hardening
            └── Sub-stage 10.3.1.1: Automated End-to-End Workflow & Release Verification [T-56]
```

---

## 3. Requirements Traceability Matrix

**Status Key:**
- `Backlog coverage verified`: Requirement has dedicated, bounded implementation and verification tickets fully mapped to authoritative contracts.
- `Needs implementation`: Application code, migrations, or frontend components must be built during implementation.
- `Needs runtime verification`: Behavioral correctness requires execution of integration/E2E/concurrency test suites.
- `Blocked by unresolved decision`: Work blocked by missing decision (Current count: 0).

| Req ID | Concise Description | Governing Implementation Tickets | Governing Verification Tickets | Planning Status | Explicit Verification Evidence Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-01** | Owner registration | `T-08`, `T-10` | `T-10`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting atomic user+business creation; React Testing Library component test in `T-10`; Playwright E2E in `T-56`. |
| **FR-02** | Owner login & dashboard access | `T-09`, `T-11`, `T-46` | `T-11`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting cookie issuance and role claims; E2E test in `T-56` asserting post-login redirect to `/portal`. |
| **FR-03** | Owner logout | `T-09`, `T-19` | `T-19`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting cookie expiration header; E2E test in `T-56` asserting redirect to `/login` and loss of protected access. |
| **FR-04** | Create/update business profile | `T-17`, `T-18` | `T-18`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-17` verifying IANA timezone and slug validation; React component test in `T-18` verifying unsaved changes alert. |
| **FR-05** | Create service (name, price, duration, active) | `T-20`, `T-21` | `T-21`, `T-56` | Backlog coverage verified; Needs implementation | Unit/integration tests in `T-20` asserting 5–1440 min and price >= 0 constraints; component test in `T-21` for modal submission. |
| **FR-06** | Edit existing service | `T-20`, `T-21` | `T-21`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-20` asserting preservation of existing appointment snapshots when service price/duration changes. |
| **FR-07** | Deactivate existing service | `T-20`, `T-21` | `T-21`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-20` asserting `IsActive = false` soft deactivation without deleting records. |
| **FR-08** | Prevent booking inactive services | `T-20`, `T-27`, `T-28`, `T-32` | `T-28`, `T-54`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-28` asserting `GET .../availability` returns HTTP 400 for inactive service; `T-32` asserting booking creation returns 400. |
| **FR-09** | Define working days/hours (split shifts) | `T-22`, `T-24`, `T-25` | `T-25`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Unit tests in `T-22` asserting overlap rejection and midnight splitting; integration test in `T-24` verifying aggregate replacement. |
| **FR-10** | Define unavailable blocked periods | `T-23`, `T-24`, `T-25` | `T-25`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Unit tests in `T-23` asserting UTC boundaries; integration test in `T-24` verifying atomic replacement locked to `Business.RowVersion`. |
| **FR-11** | Dynamic bookable slot generation | `T-28` | `T-28`, `T-54`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-54` asserting slot calculations match working hours, service duration, and exclude existing bookings and DST gaps. |
| **FR-12** | Publicly accessible booking page | `T-27`, `T-29` | `T-29`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-27` asserting 200 OK on valid slug and 404 on unknown slug/deactivated business; Playwright E2E in `T-56`. |
| **FR-13** | View active services on public page | `T-27`, `T-29` | `T-29`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-27` asserting inactive services omitted; component test in `T-29` asserting transparent price and duration display. |
| **FR-14** | Select service and date to view slots | `T-28`, `T-29` | `T-29`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Component test in `T-29` asserting interactive calendar date selection triggers availability query and renders time chips. |
| **FR-15** | Submit booking without account | `T-31`, `T-32`, `T-33` | `T-33`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Playwright E2E test in `T-56` proving complete booking from service selection to confirmation without authentication prompts. |
| **FR-16** | Require name and phone; optional email | `T-31`, `T-32` | `T-31`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-32` asserting 400 Bad Request if Name or Phone missing; component test in `T-31` verifying 3-field form boundary. |
| **FR-17** | Double-booking prevention | `T-32`, `T-54` | `T-32`, `T-54` | Backlog coverage verified; Needs runtime verification | SQL Server integration test in `T-54` firing 10 concurrent requests for exact same slot: exactly 1 returns 201, 9 return 409 Conflict. |
| **FR-18** | Create appointment on valid booking | `T-32` | `T-32`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-32` asserting Appointment created in Pending status with snapshots of service name, price, and duration. |
| **FR-19** | In-app booking confirmation page | `T-32`, `T-34` | `T-34`, `T-56` | Backlog coverage verified; Needs implementation | Playwright E2E test in `T-56` asserting display of alphanumeric ReferenceCode, reassurance copy, and zero export/cancel buttons. |
| **FR-20** | Owner view appointments list | `T-35`, `T-36` | `T-36`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-35` verifying date-filtered pagination and exclusion of private notes; component test in `T-36` for agenda view. |
| **FR-21** | Owner view appointment details | `T-37`, `T-38` | `T-38`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-37` asserting full details payload with strong ETag; component test in `T-38` for details drawer. |
| **FR-22** | Owner change appointment status | `T-37`, `T-38` | `T-38`, `T-54`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-37` verifying status lifecycle rules (Pending ➔ Confirmed/Cancelled) and idempotent repeat calls; ETag check. |
| **FR-23** | Owner reschedule appointment | `T-39`, `T-40` | `T-40`, `T-54`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-54` asserting self-exclusion from overlap check, preservation of snapshots, and 409 Conflict if target slot taken. |
| **FR-24** | Owner cancel appointment | `T-37`, `T-38` | `T-38`, `T-54`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-54` asserting cancellation releases slot for public booking and sets terminal Cancelled status. |
| **FR-25** | CRM auto-matching by phone | `T-30`, `T-32` | `T-30`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting two-tier normalization (E.164 vs fallback) and reuse of Customer.Id within same BusinessId. |
| **FR-26** | Owner view customer records | `T-41`, `T-42` | `T-42`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-41` asserting paginated CRM query excluding private notes from list; component test in `T-42` for directory table. |
| **FR-27** | Owner update customer information | `T-43`, `T-44` | `T-44`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-43` asserting 409 Conflict if updated phone collides with another customer in the same tenant. |
| **FR-28** | Owner add private text notes | `T-43`, `T-44` | `T-44`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-43` asserting persistence of Customer.Notes up to 2000 chars; test in `T-55` proving notes omitted from public APIs. |
| **FR-29** | Owner view customer history | `T-43`, `T-44` | `T-44`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-43` asserting projection of customer's historical appointments with snapshotted prices and statuses. |
| **FR-30** | Owner dashboard metrics (4 KPIs) | `T-45`, `T-46` | `T-46`, `T-54`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-54` asserting Today's, Upcoming (per Decision D-05), Customers, and Completed counts match database state. |
| **FR-31** | Extended business profile fields | `T-17`, `T-18` | `T-18`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-17` asserting atomic update of CurrencyCode/Symbol, validated TimeZoneId, and bounds (Decision D-03). |
| **FR-32** | Owner account security & password | `T-09`, `T-19` | `T-19`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting password change succeeds and updates security stamp; component test in `T-19`. |
| **FR-33** | Admin authentication & isolation | `T-09`, `T-11`, `T-14` | `T-11`, `T-55`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-55` asserting Admin role claims and access denial when Owner attempts to access `/api/v1/admin/*`. |
| **FR-34** | Admin dashboard platform metrics | `T-47`, `T-48` | `T-48`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-47` asserting global counts across all tenants; component test in `T-48` for metric cards. |
| **FR-35** | Admin search/filter businesses | `T-49`, `T-50` | `T-50`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-49` asserting search by name/slug substring and filter by Active/Inactive status. |
| **FR-36** | Admin view business details | `T-52`, `T-53` | `T-53`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-52` asserting business profile and usage counts returned with strong ETag; 404 on invalid ID. |
| **FR-37** | Admin activate/deactivate business | `T-16`, `T-52`, `T-53` | `T-53`, `T-55`, `T-56` | Backlog coverage verified; Needs runtime verification | Integration test in `T-55` verifying deactivation blocks public booking (404) and owner mutations (403); UI modal in `T-53`. |
| **FR-38** | Platform usage aggregate analytics | `T-47`, `T-48` | `T-48`, `T-56` | Backlog coverage verified; Needs implementation | Integration test in `T-47` asserting platform-wide volume counts; zero financial BI or revenue reporting. |
| **NFR-01** | Responsiveness across viewports | `T-06`, `T-07`, `T-26`, `T-56` | `T-56` | Backlog coverage verified; Needs runtime verification | Playwright automated viewport tests at 375px (mobile), 768px (tablet), and 1280px (desktop) ensuring no horizontal overflow. |
| **NFR-02** | Browser compatibility | `T-06`, `T-56` | `T-56` | Backlog coverage verified; Needs runtime verification | Automated Playwright test execution across Chromium, Firefox, and WebKit rendering engines. |
| **NFR-03** | Server response time < 2 seconds | `T-04`, `T-45`, `T-56` | `T-56` | Backlog coverage verified; Needs runtime verification | Automated benchmark in `T-56` executing 20 concurrent virtual users against seeded DB per Decision D-07, asserting p95 < 2.0s. |
| **NFR-04** | Strict tenant data isolation | `T-03`, `T-15`, `T-55` | `T-15`, `T-55` | Backlog coverage verified; Needs runtime verification | Automated security tests in `T-55` asserting Owner A receives HTTP 404 when querying Owner B's customers, services, or appointments. |
| **NFR-05** | Customer and business data protection | `T-04`, `T-09`, `T-13`, `T-55` | `T-13`, `T-55` | Backlog coverage verified; Needs runtime verification | Automated tests in `T-55` verifying HttpOnly cookies, zero tokens in localStorage, CSRF synchronizer tokens, and log PII redaction. |
| **NFR-06** | Usability: accountless guest booking | `T-29`, `T-31`, `T-33`, `T-34` | `T-34`, `T-56` | Backlog coverage verified; Needs runtime verification | Playwright E2E test in `T-56` proving 5-step guest booking journey with 3 contact fields and clear reassuring confirmation. |
| **NFR-07** | Admin-only authorization restriction | `T-14`, `T-47`, `T-49`, `T-52` | `T-52`, `T-55` | Backlog coverage verified; Needs runtime verification | Automated security test in `T-55` proving that Owner session attempting to access `/api/v1/admin/*` receives HTTP 403 Forbidden. |
| **NFR-08** | Admin data protection & oversight limits | `T-47`, `T-49`, `T-52`, `T-55` | `T-52`, `T-55` | Backlog coverage verified; Needs implementation | Integration test in `T-52` verifying that customer private notes and sensitive PII are omitted from admin inspection payloads. |
| **C-01 to C-05** | MVP Scope Boundaries & Safeguards | All tickets (`T-01` to `T-56`) | All test suites | Backlog coverage verified; Needs implementation | Architectural verification in `T-56` ensuring zero payments, multi-staff, external messaging, AI widgets, or native PWA code. |

---

## 4. Screen Coverage Matrix (All 22 Authoritative Screens)

| Screen ID | Official Screen Name | Actor | Governing Frontend Ticket | Authoritative Screen Status (from `SCREEN_INVENTORY.md`) | Visual Reference / Stitch Asset | Verification Mode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PUB-01** | Public Landing Page | Visitor | `T-26` | **Verified Export Included** | `exports/public-landing-page-desktop.png` | Playwright E2E & visual screenshot diff |
| **AUTH-01**| Business Owner Registration | Owner | `T-10` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **AUTH-02**| Business Owner Sign In | Owner / Admin | `T-11` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-01** | Owner Dashboard | Owner | `T-46` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-02** | Appointments | Owner | `T-36`, `T-38`, `T-40` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-03** | Services | Owner | `T-21` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-04** | Availability / Working Hours | Owner | `T-25` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-05** | Customers / CRM | Owner | `T-42`, `T-44` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | React Testing Library & Playwright E2E |
| **OWN-06** | Business Profile Overview | Owner | `T-18` | Approved Screen — Planned in Foundation | Foundation §10.2 (Sub-stage 5.6.1) | React Testing Library & Playwright E2E |
| **OWN-07** | Edit Business Profile | Owner | `T-18` | Approved Screen — Planned in Foundation | Foundation §10.2 (Sub-stage 5.6.2) | React Testing Library & Playwright E2E |
| **OWN-08** | Public Booking Link / Settings | Owner | `T-18` | Approved Screen — Planned in Foundation | Foundation §10.2 (Sub-stage 5.6.3) | React Testing Library & Playwright E2E |
| **OWN-09** | Account & Security | Owner | `T-19` | Approved Screen — Planned in Foundation | Foundation §10.2 (Sub-stage 5.6.4) | React Testing Library & Playwright E2E |
| **CUS-01** | Public Booking — Service Selection | Customer | `T-29` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | Playwright E2E & Axe-core |
| **CUS-02** | Public Booking — Date & Time | Customer | `T-29` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | Playwright E2E & Axe-core |
| **CUS-03** | Public Booking — Customer Details | Customer | `T-31` | Approved Screen — Match from Stitch | Stitch Project `16658083011992702116` | Playwright E2E & Axe-core |
| **CUS-04** | Public Booking — Review | Customer | `T-33` | Approved Screen — Required by Foundation | Foundation §4 & §13 (Stage 6.5) | Playwright E2E & Axe-core |
| **CUS-05** | Public Booking — Request Received | Customer | `T-34` | Approved Screen — Required by Foundation | Foundation §4 & §13 (Stage 6.6) | Playwright E2E & Axe-core |
| **ADM-01** | Admin Dashboard | Platform Admin | `T-48` | Approved Screen — Planned in Foundation | Foundation §12.1 (Sub-stage 7.5.1) | React Testing Library & Playwright E2E |
| **ADM-02** | Businesses Directory | Platform Admin | `T-50` | Approved Screen — Planned in Foundation | Foundation §12.1 (Sub-stage 7.5.2) | React Testing Library & Playwright E2E |
| **ADM-03** | Business Details | Platform Admin | `T-53` | Approved Screen — Planned in Foundation | Foundation §12.1 (Sub-stage 7.5.3) | React Testing Library & Playwright E2E |
| **ADM-04** | Platform Usage | Platform Admin | `T-48` | Approved Screen — Planned in Foundation | Foundation §12.1 (Sub-stage 7.5.4) | React Testing Library & Playwright E2E |
| **ADM-05** | Admin Account & Security | Platform Admin | `T-51` | Approved Screen — Planned in Foundation | Foundation §4 & §12 (Navigation Tree) | React Testing Library & Playwright E2E |

---

## 5. Dependency and Verification Audit

### 1. Prerequisite & Cycle Validation
- **Dependency Graph:** 56 tickets systematically validated.
- **Cycles Detected:** **Zero (0)**. The dependency graph forms a strict Directed Acyclic Graph (DAG).
- **Missing Prerequisites:** **Zero (0)**. Every dependency references an existing ticket ID (`T-01` to `T-55`) or an approved decision (`D-01` to `D-07`).
- **Duplicate Ownership:** **Zero (0)**.
  - CSRF infrastructure strictly owned by `T-13`.
  - Inactive business middleware strictly owned by `T-16`.
  - Appointment listing strictly owned by `T-36`.
  - Appointment status actions strictly owned by `T-38`.
  - Appointment rescheduling strictly owned by `T-40`.
  - Profile editing strictly owned by `T-18`.
  - Account security strictly owned by `T-19`.
  - Booking review step strictly owned by `T-33`.
  - Booking confirmation strictly owned by `T-34`.

### 2. Eleven Mandatory Verification Gates

| Gate ID | Verification Mandate | Required Verification Method | Assigned Ticket |
| :--- | :--- | :--- | :--- |
| **K-1** | **Cross-Tenant Access Denial** | Authenticated Owner A receives HTTP 404 when querying or mutating Owner B's customer, service, or appointment. | `T-15`, `T-55` |
| **K-2** | **Next.js Proxy Cookie Forwarding** | Prove multiple `Set-Cookie` headers (Auth, Antiforgery, XSRF) pass through Next.js proxy without attribute loss. | `T-12`, `T-55` |
| **K-3** | **CSRF Validation & Logout** | Unsafe requests missing `X-XSRF-TOKEN` or mismatching Origin fail with 400/403. Logout clears cookie. | `T-13`, `T-55` |
| **K-4** | **Data Protection Key Persistence** | API restarts do not invalidate previously issued, non-expired tokens (requires stable key repository). | `T-13`, `T-55` |
| **K-5** | **Rate Limiting & Proxy Headers** | Exceeding limits returns HTTP 429; spoofed `X-Forwarded-For` from untrusted proxy is rejected. | `T-05`, `T-55` |
| **K-6** | **RFC 7807 Validation Contracts** | Missing required fields and bounds violations return HTTP 400 Problem Details with camelCase keys. | `T-04`, `T-55` |
| **K-7** | **Concurrent Administrator Startup** | Starting 5 simultaneous API instances against an empty DB results in exactly 1 Admin account without deadlocks. | `T-14`, `T-55` |
| **K-8** | **Serializable Booking Concurrency** | 10 concurrent requests for exact same slot yield 1 success (201) and 9 conflicts (409), with deadlocks retried. | `T-32`, `T-54` |
| **K-9** | **Schedule Concurrency (RowVersion)** | Concurrent schedule mutations trigger `DbUpdateConcurrencyException` (412) with zero orphaned child records. | `T-24`, `T-54` |
| **K-10** | **Appointment Concurrency (ETag)** | Status updates and reschedules with stale ETag return HTTP 412 Precondition Failed. | `T-37`, `T-39`, `T-54` |
| **K-11** | **Timezone & Booking Accuracy** | Availability calculations respect daylight saving time transitions for the business's specific IANA timezone. | `T-28`, `T-54` |

---

## 6. Remaining Open Items & Implementation Assumptions

With all seven Product Owner decisions approved, **zero product scope blockers remain**. The following items are explicitly categorized as **technical implementation assumptions** that require runtime empirical proof during their assigned tickets:

1. **Next.js Multiple `Set-Cookie` Header Forwarding (Gate K-2):**
   - *Technical Assumption:* Next.js App Router `rewrites` accurately forwards multiple independent `Set-Cookie` headers downstream without comma-folding corruption.
   - *Action:* Must be empirically proven in `T-12` via an automated test harness before building dependent feature APIs.
2. **ASP.NET Core Data Protection Key Storage Topology (Gate K-4):**
   - *Technical Assumption:* In development and staging, Data Protection keys are stored in a persistent local directory (`PersistKeysToFileSystem`) to prevent token invalidation across process restarts.
   - *Action:* Verified in `T-13` and `T-55`.
3. **Kestrel / IIS Forwarded-Header Topology (Gate K-5):**
   - *Technical Assumption:* The immediate reverse proxy is known and its IP address configured in `ForwardedHeadersOptions.KnownProxies` so that `X-Forwarded-For` cannot be spoofed by untrusted clients.
   - *Action:* Configured in `T-05` and verified in `T-55`.
4. **SQL Server Error 1205 Deadlock Transient Retry Boundary (Gate K-8):**
   - *Technical Assumption:* Serializable isolation on booking creation produces range locks that trigger transient deadlocks under concurrency, which are safely resolved within 3 retries.
   - *Action:* Empirically proven against real SQL Server in `T-32` and `T-54`.

---

## 7. Final Verdict

**Verdict: `Ready for final user approval`**

### Summary of Readiness
1. **100% Decision Alignment:** All seven Product-Owner decisions (D-01 through D-07) are fully incorporated without residual ambiguities.
2. **Zero Missing Requirements:** All 38 Functional Requirements, 8 Non-Functional Requirements, and 5 Constraints are completely mapped.
3. **Zero Missing Screens:** All 22 authoritative screens from `SCREEN_INVENTORY.md` are accounted for with explicit evidence distinctions.
4. **Clean Execution Graph:** 56 bounded, non-overlapping tickets formed into an auditable DAG with zero cycles and zero duplicate ownership.
5. **No Code / Remote Pollution:** Zero lines of code modified, zero migrations generated, zero commits created, and zero YouGile entities touched during reconnaissance and reconciliation.
