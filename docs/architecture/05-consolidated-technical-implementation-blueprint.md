# 05 Consolidated Technical Implementation Blueprint

## A. Purpose, Scope, and Status

**Status:** Implementation Plan (Phase 6.6.2)

This document serves as the consolidated, implementation-ready technical blueprint for the BookFlow MVP. Its purpose is to unify the approved architectural decisions, data models, API contracts, and UI/UX foundations into a coherent plan for development. 

**Important:** This document is an *implementation plan*. It describes the design requirements and constraints that *will* be built. It is not evidence of an already implemented system. No application code, database migrations, or automated tests currently exist to satisfy these requirements.

The scope of this blueprint strictly adheres to the academic MVP boundary defined in the MVTS v1.1. Explicit exclusions remain in effect: no payments, no multi-staff/multi-location features, no external third-party messaging (SMS/WhatsApp), no advanced analytics, no customer self-service portals, and no microservices or distributed caching (e.g., Redis).

## B. Source Register and Traceability

### Authoritative Sources and Precedence
Authority is applied by subject matter:
- **Product Scope & Requirements:** `docs/specifications/mvts.txt` (v1.1)
- **Visual & Interaction Design:** `ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md`
- **Technical Architecture:** Architecture specifications (`01` through `04`) govern their respective domains.
- **Specific Technical Decisions:** ADRs `0002` through `0006` govern the specific mechanisms they record.
- **Workflow & Restrictions:** `docs/project-management/ANTIGRAVITY_IMPLEMENTATION_RULES.md`

### Traceability Matrix
- **System Architecture & Stack:** `01-system-architecture.md`, `ANTIGRAVITY_IMPLEMENTATION_RULES.md`
- **Data Model & Schema:** `02-data-model.md`
- **Concurrency & Integrity:** `03-concurrency-and-integrity.md`, `02-data-model.md`
- **API Contracts:** `04-api-contracts.md`
- **Authentication & Sessions:** `01-system-architecture.md`, `ADR-0002`, `04-api-contracts.md`
- **Authorization & Tenant Isolation:** `ADR-0004`, `04-api-contracts.md`, `02-data-model.md`
- **CSRF & Proxy Configuration:** `ADR-0003`, `04-api-contracts.md`
- **Administrator Provisioning:** `ADR-0005`, `04-api-contracts.md`
- **Validation, Payload & Rate Limits:** `ADR-0006`, `04-api-contracts.md`
- **UI/UX Foundations:** `ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md`

### Gaps and Contradictions
There are no direct contradictions among the authoritative sources. However, several decisions are documented as "Proposed" (e.g., specific string length limits, session expiration times, dashboard metric definitions) and remain unresolved. These are documented in Section I.

## C. System Architecture

BookFlow is designed as a **modular monolith** with a separated frontend and backend.

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query.
- **Backend:** ASP.NET Core 8 Web API, C# (Clean Architecture layering).
- **Persistence:** Entity Framework Core (EF Core), Microsoft SQL Server.
- **Identity:** ASP.NET Core Identity.

**Boundaries:**
- The Next.js frontend delivers the UI and proxies all `/api/*` traffic to the ASP.NET Core API.
- The ASP.NET Core API is the sole owner of the database and business logic.
- Tenant isolation is strictly enforced by the backend, partitioning data by `BusinessId`. An owner can never access another business's data, yielding a `404 Not Found` upon attempted access.
- Unapproved infrastructure (e.g., Redis, RabbitMQ, microservices) is strictly prohibited.

## D. Data Model and Migration Plan

The database will be implemented using EF Core with SQL Server.

- **Relationships & Isolation:** Enforced via composite foreign keys (e.g., `(ServiceId, BusinessId)`).
- **Uniqueness:** Tenant-scoped unique constraints (e.g., `UNIQUE (BusinessId, NormalizedPhone, IsPhoneValid)`).
- **Soft Deactivation:** `Service.IsActive` and `Business.IsActive` flags control state. Deletions from `Appointment` to `Service` and `Customer` are set to RESTRICT to preserve history.
- **Snapshots:** `Appointment` records snapshot the service name, price, and duration at booking time.
- **Constraints to Align:** Proposed constraints (`Business.Name` max 100, `Business.Slug` max 100 with regex, `ApplicationUser.Email` max 256) must be implemented consistently across EF Core configurations, database schema, and API validation.
- **Service Bounds:** Duration must be between 5 and 1440 minutes; price must be >= 0.

*(Note: Schema constraints, EF migrations, and database tests do not exist yet and must be created during implementation).*

## E. Authentication, Authorization, and Security

- **Sessions:** Cookie-backed ASP.NET Core Identity sessions. No browser JWTs.
- **Proxy:** Next.js proxies `/api/*` requests. It must accurately forward `Cookie` and `Set-Cookie` headers.
- **CSRF Protection:** ASP.NET Core's `AutoValidateAntiforgeryTokenAttribute` enforces a two-part synchronizer token (HttpOnly cookie + `XSRF-TOKEN`) for all unsafe requests.
- **Origin Validation:** Strict full-origin matching (Scheme + Hostname + Port) against an allowlist for unsafe requests.
- **Tenant Isolation:** Derived solely from the authenticated `ClaimsPrincipal`. Cross-tenant access is mechanically denied (`404 Not Found`).
- **Authorization:** Server-side role checks (`Owner` vs. `Admin`). `Business.IsActive` is authoritatively checked against the database for owner mutations.
- **Admin Provisioning:** Initial administrator is provisioned via protected configuration at startup using Identity `UserManager`/`RoleManager`. No public admin creation endpoints.
- **Security Protections:** 1 MB JSON payload limit. ASP.NET Core rate limiting partitioned by Client IP (using secure `ForwardedHeadersMiddleware`). Passwords, tokens, and PII are redacted from logs. Generic 500 error responses hide internal details.
  - *Per-Process Rate-Limiting Constraint:* ASP.NET Core in-memory rate limits are maintained independently by each application process. In a multi-instance deployment, each instance can admit requests independently, so the combined effective allowance may exceed the configured per-process limit. Redis and distributed rate limiting remain excluded from the approved MVP scope. Trusted-proxy configuration and safe client-IP extraction remain required implementation and verification tasks.

## F. API Implementation Plan

Endpoints will follow the established contracts in `04-api-contracts.md`:

1. **Authentication:** `/api/v1/auth/csrf`, `login`, `register`, `logout`, `me`, `change-password`.
2. **Public Booking:** `/api/v1/public/b/{slug}` (profile, services, availability, bookings).
3. **Business Profile:** `/api/v1/business-profile`.
4. **Services:** `/api/v1/services`.
5. **Schedules:** `/api/v1/availability` (GET/PUT with aggregate replacement semantics).
6. **Appointments:** `/api/v1/appointments` (list, details, status, reschedule).
7. **CRM:** `/api/v1/customers`.
8. **Dashboard:** `/api/v1/dashboard/metrics`.
9. **Administration:** `/api/v1/admin/metrics`, `/api/v1/admin/businesses`.

All endpoints use `camelCase` JSON. Validation errors return RFC 7807 Problem Details (`400 Bad Request`). 

**Pagination Semantics:**
- Default page number: `1`.
- Default page size: `50`.
- Maximum page size: `100`.
- Invalid pagination values follow the existing API validation contract.

**Date Range Semantics:**
- *Public Booking:* Date ranges are capped at 31 days.
- *Appointments (`GET /api/v1/appointments`):* When both `startDate` and `endDate` are omitted, the query defaults to the current calendar month in the business's configured `TimeZoneId`. When both dates are supplied, the maximum range is 366 calendar days, inclusive. Supplying only one date or supplying a reversed or over-limit range returns `400 Bad Request`.

## G. Concurrency and Data Integrity

The system relies on native SQL Server mechanisms to guarantee integrity. **These are design requirements and remain unverified until implemented and integration tested.**

1. **Booking Overlap Prevention:** `POST /api/v1/public/b/{slug}/bookings` uses a `Serializable` transaction to execute an overlap predicate check and insert the appointment.
2. **Deadlock Recovery:** The application must implement bounded retries to recover from SQL Server Error 1205 (deadlock) during concurrent booking attempts.
3. **Schedule Protection:** `PUT /api/v1/availability` performs an atomic aggregate replacement. It relies on a `Business.RowVersion` concurrency token. EF Core `DbUpdateConcurrencyException` triggers a full transaction rollback.
4. **Appointment Concurrency:** Appointment status updates and rescheduling use a `RowVersion` token exposed as a strong HTTP `ETag` (matched via `If-Match`), returning `412 Precondition Failed` on conflict.

## H. Frontend Architecture and Proxy

- **Framework:** Next.js (App Router).
- **Route Groups:** 
  - `/b/[slug]` (Public Booking)
  - `/portal` (Business Owner Portal)
  - `/admin` (Platform Administrator Portal)
- **Data Fetching:** TanStack Query for server-state caching, loading states, and mutations.
- **API Proxy:** Next.js `rewrites` handles the proxy to the backend, enabling cookie persistence without CORS overhead.
- **Form Validation:** Handled locally before submission, but the backend is the authoritative source for rules.
- **Exclusions:** Redux, SignalR, installed-PWA infrastructure, and native app wrappers are prohibited.

## I. Decisions and Assumptions Register

| ID | Topic | Status | Existing Decision / Assumption | Required Action | Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Session Lifetime** | Unresolved | `ADR-0002` proposes 14-day sliding expiration, but absolute maximum lifetime and browser restart persistence are unfinalized. | **Resolve before implementation.** Must configure exact Identity cookie options. | `ADR-0002` |
| **D-02** | **Security-Stamp Validation** | Unresolved | Session revocation speed after a password change depends on the `SecurityStampValidatorOptions` interval. | **Resolve before implementation.** Define an explicit interval (e.g., 5 minutes) for security responsiveness. | `ADR-0002` |
| **D-03** | **String Constraints** | Unresolved | `Business.Name`, `Business.Slug`, and `ApplicationUser.Email` lengths and formats are proposed. | **Resolve before implementation.** Accept constraints to align DB schema, EF Core, and API validation. | `04-api-contracts.md`, `ADR-0006` |
| **D-04** | **Dashboard Metrics** | Unresolved | Interpretations of "Upcoming", "Today", etc. are proposed in the API contract. | **Defer.** Can be adjusted during implementation without major architectural impact. | `04-api-contracts.md` (Sec 6) |
| **D-05** | **Rate Limiting Config** | Unresolved | Limits are proposed; `X-Forwarded-For` proxy parsing topology is ambiguous. | **Defer to infrastructure stage.** Local testing can proceed, but prod proxy config must be defined later. | `ADR-0006` |
| **D-06** | **CSRF & Next.js Proxy** | Assumption | Assuming Next.js correctly proxies multiple `Set-Cookie` headers seamlessly. | **Verify during Stage 3** (Proof of Concept). | `ADR-0003` |

## J. Implementation Sequence and Dependency Gates

| Stage | Focus | Entry Conditions | Exit Criteria |
| :--- | :--- | :--- | :--- |
| **1. Backend & Database Foundation** | EF Core, Data Model, Repositories | Approval of this Blueprint. | Schema generated, composite constraints verified via tests. |
| **2. Identity & Admin Provisioning** | Identity setup, Startup Admin creation | Stage 1 complete. | Concurrent startup tests pass; no duplicate admins created. |
| **3. Security Proof of Concept** | Next.js proxy, CSRF, Cookie Auth, Data Protection | Stage 2 complete. | End-to-end tests prove Next.js forwards multiple cookies; CSRF validates successfully. |
| **4. Owner APIs (Part 1)** | Profile, Services, Schedule APIs | Stage 3 complete. | Schedule aggregate update verified with `RowVersion` rollback tests. |
| **5. Booking Engine** | Public Availability, Booking Transaction | Stage 4 complete. | Serializable transaction double-booking tests pass; bounded retries confirmed. |
| **6. Owner APIs (Part 2) & CRM** | Appointments, CRM, Status transitions | Stage 5 complete. | ETag concurrency tests pass for appointments; tenant isolation tests pass. |
| **7. Dashboard & Administration** | KPIs, Business Management endpoints | Stage 6 complete. | Admin authorization boundary verified. |
| **8. Frontend Integration** | UI implementation mapped to API | Stage 7 complete, UI Foundation frozen. | All workflows function end-to-end with validation, loading, and error states. |

*(Note: Security and proxy mechanisms are prioritized early in Stage 3 to de-risk fundamental architectural assumptions).*

## K. Verification and Acceptance Register

The following mandatory tests and proof-of-concept tasks must be satisfied to close their respective stages:

1. **Cross-Tenant Access Denial:** Prove that an authenticated owner receives `404 Not Found` when requesting `Customer` or `Appointment` records belonging to another `BusinessId`.
2. **Next.js Proxy Cookie Forwarding:** Prove that Next.js correctly forwards `Auth`, `Antiforgery`, and `XSRF-TOKEN` headers between the browser and the API without dropping headers.
3. **CSRF Validation & Logout:** Prove that unsafe requests missing the `X-XSRF-TOKEN` or mismatching the `Origin` are blocked with `400` or `403`. Prove that `POST /api/v1/auth/logout` clears the authentication cookie.
4. **Data Protection Key Persistence:** Prove that API restarts do not cryptographically invalidate previously issued, non-expired Antiforgery tokens (requires persistent key storage configuration).
5. **Rate Limiting & Proxy Headers:** Prove that `429 Too Many Requests` is returned when limits are exceeded, and that `ForwardedHeadersMiddleware` rejects spoofed `X-Forwarded-For` IPs from untrusted sources.
6. **Validation Contracts:** Prove that missing required fields and strings exceeding maximum bounds return `400 Bad Request` in RFC 7807 format.
7. **Concurrent Administrator Startup:** Prove that starting 5 simultaneous API instances against an empty database results in exactly one Admin account, without deadlocks or corruption.
8. **Booking Concurrency (Serializable):** Prove that firing 10 simultaneous booking requests for the exact same available slot results in exactly 1 success and 9 conflicts (`409`), with transient deadlocks automatically retried.
9. **Schedule Concurrency (RowVersion):** Prove that concurrent schedule mutations result in a `DbUpdateConcurrencyException`, returning `412 Precondition Failed` and leaving zero orphaned period records in the database.
10. **Appointment Concurrency (ETag):** Prove that status updates using a stale ETag are rejected with `412 Precondition Failed`.
11. **Timezone & Booking Accuracy:** Prove that availability calculations respect daylight saving time transitions for the business's specific `TimeZoneId`.
