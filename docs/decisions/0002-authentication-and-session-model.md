# ADR-0002: Authentication and Session Model

**Status:** Approved (Architecture) / Proposed (Session Expiry)

## Context
BookFlow requires secure authentication for two distinct actors: Business Owners and Platform Administrators. The system architecture utilizes Next.js for the frontend and ASP.NET Core 8 Web API for the backend, separated by a `/api/*` proxy boundary. We must determine the authentication technology, session persistence mechanism, registration integrity guarantees, and role boundaries without introducing unnecessary complexity.

## Decision
1. **ASP.NET Core Identity:** We will use ASP.NET Core Identity with a customized `ApplicationUser : IdentityUser` model for persistence and password hashing.
2. **Cookie-Backed Sessions:** Browser authentication will use HTTP-only cookies issued by the .NET API and forwarded through the Next.js proxy. We will NOT introduce browser JWT access/refresh tokens.
3. **Shared Login Endpoint:** Both Owners and Admins will authenticate via a single `POST /api/v1/auth/login` endpoint. Server-side role membership (`Owner` vs. `Admin`) determines API authorization capabilities. The `GET /api/v1/auth/me` endpoint will return the authenticated user's role to drive frontend navigation.
4. **Registration Integrity:** `POST /api/v1/auth/register` is dedicated to Owner registration. It strictly assigns the `Owner` role on the server. Registration must guarantee that no orphaned `ApplicationUser` record remains without its corresponding `Business`; the implementation mechanism required to enforce this guarantee remains subject to verification. Public administrator registration is prohibited.
5. **Session Invalidation:** `POST /api/v1/auth/logout` clears the browser cookie and invalidates the current authenticated session to the extent supported by the selected mechanism (this does not automatically revoke copied cookies or all other sessions). Authenticated password changes remain supported. Unauthenticated email-based password resets are excluded from the MVP.
6. **Inactive Business Authorization:** Owners of deactivated businesses may authenticate and retain authorized read-only historical access. Owner mutations are explicitly denied while the business is inactive.

## Unresolved Questions / Proposed Policies
- **Initial Admin Provisioning:** The exact mechanism to provision the first administrator account remains unresolved (deferred to Phase 6.4.4).
- **Session Policy (Proposed):** A 14-day sliding session expiration is proposed. This distinguishes sliding idle expiration from absolute maximum session lifetime and cookie persistence across browser restarts, which must be explicitly configured and verified.
- **Security-Stamp Revocation:** Validation of the ASP.NET Core Identity security stamp relies on a configured interval. Changing a password updates the stamp, but secondary sessions may not be immediately revoked depending on this interval. This behavior must be verified during implementation.

## Consequences
- The BFF proxy pattern avoids cross-origin resource sharing (CORS) complexity and token storage risks.
- Relying on server-side roles prevents privilege escalation via client manipulation.
- Registration must guarantee that no orphaned `ApplicationUser` record remains without its corresponding `Business`; the implementation mechanism required to enforce this guarantee remains subject to verification.
