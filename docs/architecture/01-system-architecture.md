# 01 System Architecture

## Overview

BookFlow is an appointment booking and lightweight CRM platform designed specifically for independent, single-operator service businesses. The application is architected as a **modular monolith** with a separated frontend and backend, avoiding the complexity of microservices, which is out of scope for this MVP.

## Technology Stack

### Frontend
- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (for server-state fetching, caching, and loading/error states)

### Backend
- **Framework:** ASP.NET Core 8 Web API
- **Language:** C#
- **Identity:** ASP.NET Core Identity
- **Persistence (ORM):** Entity Framework Core (EF Core)
- **Database:** Microsoft SQL Server
- **API Documentation:** OpenAPI / Swagger

## Backend Boundaries (Clean Architecture)

The backend follows Clean Architecture-style separation of concerns to enforce strict dependency rules:

1. **Domain Layer:** Core entities (`Business`, `Customer`, `Service`, `Appointment`, etc.), business rules, custom exceptions, and interface definitions. Contains no external dependencies.
2. **Application Layer:** Use cases, business workflows, DTOs, and application validation. Depends only on the Domain Layer.
3. **Infrastructure Layer:** EF Core `DbContext`, repository implementations, and ASP.NET Core Identity integration. Depends on Application and Domain layers.
4. **API / Presentation Layer:** HTTP controllers, routing, Swagger/OpenAPI configuration, dependency injection setup, and authentication middleware. Depends on Application and Infrastructure layers.

## Route Boundaries and Navigation Shells

The Next.js frontend delivers the UI across three explicitly isolated route groups, enforcing strict presentation and navigation boundaries:

- **Public Customer Booking (`/b/[slug]`):** An accountless, frictionless public guest booking journey. Customers browse active services and available time slots.
- **Business Owner Portal (`/portal`):** An authenticated SaaS shell for solo operators to manage their business profile, services, schedule, CRM, appointments, and account.
- **Platform Administrator Portal (`/admin`):** An authenticated separate admin portal for platform-wide administrative visibility and business account management.

*Note: Next.js layouts and route groups are presentation boundaries only. The ASP.NET Core API independently authorizes all protected requests.*

## Tenant Isolation and Ownership

- **One Business Per Owner:** The system enforces a strict 1:1 ownership constraint. An authenticated business owner (`ApplicationUser`) manages exactly one `Business`.
- **Data Isolation:** All business-owner endpoints must extract the Owner ID from the authenticated claims and inherently scope all database queries to prevent cross-tenant data leakage.
- **Dual-Layer Integrity:** Tenant integrity requires both application-level scoped queries and database-level composite foreign keys and constraints.

## Authoritative Activation State

- **Dynamic Evaluation:** For mutating operations, the business `IsActive` state must be evaluated against the authoritative SQL Server database, rather than trusting a cached principal or client input.

## API and Communication Strategy

The backend exposes a **RESTful HTTP API** documented with OpenAPI/Swagger. The Next.js frontend uses TanStack Query to manage data exchange, utilizing JSON payloads that map to TypeScript interfaces generated or aligned with the OpenAPI specification.

**API Defenses and Limits:**
- **Request Limits:** All JSON request bodies are bounded to a maximum size of 1 MB to prevent memory exhaustion.
- **Rate Limiting:** Built-in ASP.NET Core Rate Limiting (per-process, memory-based) protects critical endpoints (Authentication, Registration, and Public Booking). Exceeding limits returns `429 Too Many Requests`. The Client IP serves as the partition key, explicitly requiring secure `ForwardedHeadersMiddleware` configuration. Redis is explicitly excluded.
- **Logging Safety:** No request or response payloads are logged by default. Secrets and PII are redacted. Unhandled exceptions return generic `500` error messages without exposing stack traces or SQL details.

## Authentication Direction

**Approved Strategy:** The MVP utilizes **ASP.NET Core Identity** (`ApplicationUser : IdentityUser`) for registration, password hashing, and role validation (`Owner` vs. `Admin`).
**Session Management:** Authentication sessions are managed via **HTTP-only Cookies** issued by the .NET API. To avoid CORS complexity and the need for a heavy Backend-For-Frontend (BFF), Next.js rewrites (`next.config.js`) proxy `/api/*` traffic directly to the .NET API. **No browser JWT access/refresh tokens are used.**

*Session Policy (Proposed):* A 14-day sliding session expiration is proposed. This policy defines the sliding idle expiration; any absolute maximum session lifetime and cookie persistence across browser restarts must be explicitly verified. ASP.NET Core Identity security-stamp validation will handle session revocation (e.g., after password changes), but its immediate effect depends on the configured validation interval.

*Security Configuration & CSRF:* A global ASP.NET Core antiforgery filter (`AutoValidateAntiforgeryTokenAttribute`) enforces CSRF protection for all unsafe browser requests within its configured MVC filter scope, utilizing a two-part synchronizer token (an `HttpOnly` cookie and a JS-readable `XSRF-TOKEN`). Strict Origin/Referer full-origin matching provides defense in depth. Trusted origin allowlists and forwarded-header configurations must be explicitly defined per environment.

*Pending Implementation Verification:* Next.js rewrites must be empirically proven to correctly forward multiple independent `Set-Cookie` headers without corruption. The exact lifecycle of token issuance during login, the concrete validation scope of the antiforgery attribute, and the stable persistence of Data Protection keys across application restarts, must be verified during the proof of concept. The concurrent safety of the administrator provisioning mechanism must also be verified to prevent duplicate accounts during simultaneous startup.

## Excluded Technologies and Complexity

To maintain the MVP scope defined in the [BookFlow MVTS](../specifications/BookFlow_MVTS_v1.1.docx), the following are explicitly excluded:
- Microservices and distributed caching (e.g., Redis).
- Native mobile applications (iOS/Android) and installed-PWA features.
- Payment processing, invoicing, or deposits.
- Third-party external messaging integrations (WhatsApp, SMS, external email providers).
- AI receptionists, chatbots, or advanced predictive analytics.

## Deferred Decisions

The exact hosting providers and deployment architecture remain deferred to a later phase. See [ADR-0001: Deferred Hosting Deployment](../decisions/0001-deferred-hosting-deployment.md).

## References

- [Authoritative MVTS v1.1](../specifications/BookFlow_MVTS_v1.1.docx)
- [02 Data Model](./02-data-model.md)
- [03 Concurrency and Integrity](./03-concurrency-and-integrity.md)
