# BookFlow

[![Project Stage](https://img.shields.io/badge/stage-Phase%207%20Complete%20%7C%20Phase%208%20Ready-blue)](https://github.com/Precious-gift/BookFlow)
[![Agile Board](https://img.shields.io/badge/trello-BookFlow%20MVP-0079BF?logo=trello)](https://trello.com/b/3BOlXBHK/bookflow-mvp-implementation)
[![Specification](https://img.shields.io/badge/specification-MVTS%20v1.1-success)](docs/specifications/BookFlow_MVTS_v1.1.docx)
[![UI/UX Foundation](https://img.shields.io/badge/design%20freeze-v1.1-purple)](ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md)

BookFlow is an appointment booking and lightweight customer relationship management (CRM) web platform designed specifically for independent, single-operator service businesses (such as barbershops, private personal trainers, and solo consultants).

---

## 1. Project Status & Academic MVP Scope

### Current Status
> **Current Stage:** Planning, Architecture, UI/UX Foundation, and Backlog Preparation Completed (Phases 1 through 7).<br>
> **Implementation Status:** Not yet started. Full-stack scaffolding and ticket implementation begin in Phase 8 (`T-01` through `T-56`). The `backend/`, `frontend/`, and `tests/` directories are currently empty placeholders awaiting implementation.

### Academic MVP Scope
BookFlow is developed as an academic software engineering capstone project adhering to Clean Architecture principles, strict multi-tenant boundaries, and formal Agile governance.

#### Primary Actors
- **Customer (Public / Guest):** Browses active services and available time slots, then submits an appointment request **without registering or creating an account**.
- **Business Owner (Authenticated):** Configures business profile, services, working hours, and unavailable periods; manages the appointment lifecycle; maintains customer CRM records and internal notes; and monitors daily operational metrics.
- **Platform Administrator (Authenticated Portal):** Oversees registered businesses, toggles business activation status, and monitors aggregate platform metrics.

#### In-MVP Capabilities
- Business owner registration, cookie-backed authentication, session management, and password security.
- Business profile and public booking-identity management.
- Service catalog management (name, price, duration, active status).
- Operating schedules, working shifts, and blocked/unavailable periods.
- Public guest booking engine with daylight-saving-time-aware slot calculation.
- Guaranteed double-booking prevention via backend `Serializable` transactions.
- Appointment lifecycle tracking (`Pending` → `Confirmed` → `Completed` / `Cancelled`) with owner-controlled rescheduling.
- Single-operator CRM with phone-number matching, contact management, notes, and appointment history.
- Business owner dashboard (today's appointments, upcoming appointments, total customers, completed appointments).
- Isolated platform administrator portal for business oversight and basic usage analytics.

#### Explicit Out-of-Scope Boundaries (Strictly Excluded)
To preserve academic delivery timelines and focus on engineering quality over feature breadth, the following features are deliberately **excluded** from the MVP:
- **No Online Payments:** No Stripe, PayPal, deposit collection, or automated invoicing.
- **No External Messaging:** No SMS (Twilio), WhatsApp API, or third-party transactional email delivery.
- **No Customer Accounts:** Customers never log in; booking confirmations are in-app screens only.
- **No Multi-Staff / Multi-Location:** Single-operator scheduling only.
- **No AI / LLM Integrations:** No AI booking receptionists or automated chatbot widgets.
- **No Distributed Infrastructure:** No Redis caching, microservices, or RabbitMQ message brokers.

---

## 2. Operational Agile Board & Backlog Management

- **Public Trello Board:** [BookFlow — MVP Implementation](https://trello.com/b/3BOlXBHK/bookflow-mvp-implementation)
- **Workflow State Columns:** `Backlog` → `Ready` → `In Progress` → `Review` → `Done` (plus `Blocked`).
- **Implementation Tickets:** Exactly 56 tickets (`[T-01]` through `[T-56]`) spanning 10 Epics:
  - `E-01 Foundation & Infrastructure` (`T-01` – `T-06`)
  - `E-02 Identity & Access Management` (`T-07` – `T-10`)
  - `E-03 Business & Service Management` (`T-11` – `T-17`)
  - `E-04 Staff & Availability Management` (`T-18` – `T-24`)
  - `E-05 Public Booking Engine` (`T-25` – `T-31`)
  - `E-06 Appointment Lifecycle Management` (`T-32` – `T-38`)
  - `E-07 Customer Engagement & Notifications` (`T-39` – `T-43`)
  - `E-08 Dashboard & Operational Metrics` (`T-44` – `T-47`)
  - `E-09 System Administration & Cross-Cutting` (`T-48` – `T-52`)
  - `E-10 End-to-End Validation & Release Gate` (`T-53` – `T-56`)
- **Card Standards:** Every card contains an explicit 6-level hierarchy breadcrumb, objective, scope, API requirements, blocking prerequisites, satisfied planning decisions, UI references, and an interactive **Acceptance Criteria Checklist**.
- **Repository Backlog Assets:** See [`docs/project-management/backlog/`](docs/project-management/backlog/) for the machine-readable dataset ([`backlog_manifest.json`](docs/project-management/backlog/backlog_manifest.json)) and narrative backlog package ([`BOOKFLOW_MVP_BACKLOG_PACKAGE_v1.0.md`](docs/project-management/backlog/BOOKFLOW_MVP_BACKLOG_PACKAGE_v1.0.md)).

---

## 3. Authoritative Documentation Map

All development must maintain strict traceability against the approved documentation:

| Document Area | Primary Reference | Contents / Purpose |
| :--- | :--- | :--- |
| **Product Specification** | [BookFlow MVTS v1.1 (.docx)](docs/specifications/BookFlow_MVTS_v1.1.docx) & [mvts.txt](docs/specifications/mvts.txt) | Authoritative requirements, actors, user scenarios, functional requirements (`FR-01`–`FR-38`), and acceptance criteria. |
| **UI/UX Design Freeze** | [Authoritative Foundation v1.1](ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md) | Frozen design tokens, palette (`#2563EB` primary), typography, component specs, and responsive rules. |
| **Screen Taxonomy** | [Screen Inventory](ui-ux/screens/SCREEN_INVENTORY.md) & [Screen Exports](ui-ux/screens/exports/) | 22 authoritative screen taxonomy IDs; 30 locally exported HTML/PNG prototype pairs (covering core screens and state variants), distinct from separate Stitch cloud screen instances. |
| **User Journeys** | [User Flows](ui-ux/flows/USER_FLOWS.md) | Step-by-step visual and behavioral paths for Customer, Owner, and Administrator. |
| **UI Implementation** | [UI/UX Implementation Guide](ui-ux/UI_UX_IMPLEMENTATION_GUIDE.md) | Implementation guidance, component mapping, and accessibility rules. |
| **System Architecture** | [01 System Architecture](docs/architecture/01-system-architecture.md) | Modular monolith architecture, Clean Architecture layering, Next.js proxy design, and route boundaries. |
| **Data Model & Schema** | [02 Data Model](docs/architecture/02-data-model.md) | EF Core schema, multi-tenant isolation via `BusinessId`, composite foreign keys, and soft-deactivation. |
| **Concurrency & Integrity** | [03 Concurrency & Integrity](docs/architecture/03-concurrency-and-integrity.md) | Serializable booking transactions, deadlock retry policies, and `RowVersion` optimistic concurrency. |
| **API Contracts** | [04 API Contracts](docs/architecture/04-api-contracts.md) | RFC 7807 problem details, route endpoints, date boundaries, and pagination limits. |
| **Implementation Plan** | [05 Technical Blueprint](docs/architecture/05-consolidated-technical-implementation-blueprint.md) | Phase 6.6.2 consolidated blueprint detailing implementation stages and verification gates. |
| **Architecture Decisions** | [ADR Index](docs/decisions/README.md) | Formal records for hosting (`ADR-0001`), authentication (`ADR-0002`), CSRF proxy (`ADR-0003`), tenant isolation (`ADR-0004`), admin provisioning (`ADR-0005`), and validation limits (`ADR-0006`). |
| **Engineering Rules** | [Antigravity Implementation Rules](docs/project-management/ANTIGRAVITY_IMPLEMENTATION_RULES.md) | Permanent guidelines for scope protection, security boundaries, and code quality. |

---

## 4. Planned Technology Stack & Repository Structure

### Planned Technology Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query.
- **Backend:** ASP.NET Core 8 Web API, C#, Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`).
- **Database & ORM:** Microsoft SQL Server, Entity Framework Core 8.
- **Identity & Security:** ASP.NET Core Identity, cookie-backed sessions, two-part antiforgery CSRF validation.
- **Testing:** xUnit / FluentAssertions / WebApplicationFactory (Backend), Jest / React Testing Library / Playwright (Frontend & E2E).

### Repository Structure
```text
BookFlow/
├── backend/                  # ASP.NET Core 8 Clean Architecture solution (Scaffolded in T-01)
├── frontend/                 # Next.js App Router frontend application (Scaffolded in T-02)
├── tests/                    # End-to-end and cross-cutting integration test suites (Scaffolded in T-03)
├── docs/                     # Authoritative engineering documentation
│   ├── architecture/         # System architecture, data model, concurrency, and API contracts
│   ├── decisions/            # Architecture Decision Records (ADRs 0001–0006)
│   ├── project-management/   # Implementation rules, Agile backlog, and process governance
│   │   ├── backlog/          # Canonical 56-ticket manifest, backlog package, and Trello board link
│   │   └── archive/yougile/  # Historical Phase 7.2 YouGile evaluation artifacts
│   ├── requirements/         # Requirements traceability index
│   └── specifications/       # Authoritative MVTS v1.1 (.docx and .txt)
├── ui-ux/                    # Frozen UI/UX design assets, screen inventory, and HTML/CSS exports
├── CONTRIBUTING.md           # Branching strategy, commit conventions, and review criteria
└── README.md                 # Project roadmap and technical overview
```

---

## 5. Prerequisites & Environment Configuration

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (`dotnet --version` >= 8.0.x)
- [Node.js](https://nodejs.org/) & `npm` (minimum version to be confirmed upon Phase 8 frontend scaffolding)
- [Microsoft SQL Server](https://www.microsoft.com/sql-server/) (Developer Edition, Express, or LocalDB `(localdb)\mssqllocaldb`)
- [Git](https://git-scm.com/)

### Environment Configuration *(Planned — Configured during T-01 & T-02)*
1. **Backend Configuration:**
   - Development settings will be configured in `backend/src/BookFlow.Api/appsettings.Development.json`.
   - Never commit connection strings containing passwords or secret keys.
2. **Frontend Configuration:**
   - Local environment variables will reside in `frontend/.env.local`.
   - The frontend reverse-proxy forwards `/api/*` requests to the backend URL without CORS overhead.

### Build & Run Commands *(Planned — Available once scaffolded in Phase 8)*
```bash
# Backend (.NET 8 Web API)
cd backend
dotnet restore
dotnet build
dotnet run --project src/BookFlow.Api

# Frontend (Next.js)
cd frontend
npm install
npm run dev
```

### Verification & Testing Commands *(Planned — Available once scaffolded in Phase 8)*
```bash
# Backend Tests (Unit & Integration)
dotnet test

# Frontend Unit Tests & E2E Validation
cd frontend
npm run test
npm run test:e2e
```

---

## 6. Contribution Rules & Development Governance

All contributors and AI agents must follow the conventions defined in [CONTRIBUTING.md](CONTRIBUTING.md) and [ANTIGRAVITY_IMPLEMENTATION_RULES.md](docs/project-management/ANTIGRAVITY_IMPLEMENTATION_RULES.md):

1. **Branching:** Never develop substantial features directly on `main`. Create short-lived branches (`feature/<ticket-id>-<description>`, `fix/<description>`, `docs/<description>`).
2. **Commits:** Follow Conventional Commits format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
3. **Traceability:** Pull requests must reference the relevant Trello ticket ID (`[T-XX]`) and verify its Acceptance Criteria checklist.
4. **Data Isolation & Security:** Multi-tenant isolation (`BusinessId`) and authorization checks must be strictly enforced on the backend. Never commit secrets, credentials, or `.env` files.
