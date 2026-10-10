# ADR-0003: CSRF and Proxy Configuration

**Status:** Approved (Architecture) / Proposed (Settings) / Verification Needed (Proxy Behavior)

## Context
BookFlow's architecture relies on cookie-backed authentication without browser JWTs. The Next.js frontend proxies `/api/*` requests to the ASP.NET Core 8 Web API. This pattern requires robust Cross-Site Request Forgery (CSRF) protection for all unsafe browser operations (e.g., POST, PUT, DELETE, PATCH), including those that occur before authentication.

We must define the proxy behavior, token lifecycle, and validation policies while clearly separating verified architectural directions from assumptions that require empirical proof during implementation.

## Decision

### 1. Proxy and Cookie Flow
- **Next.js Rewrites:** The frontend utilizes Next.js `rewrites` to proxy requests to the API. This proxy must seamlessly forward `Cookie` headers upstream and `Set-Cookie` headers downstream without corruption.
- **Empirical Verification Required:** Node.js proxies historically struggle with folding multiple `Set-Cookie` headers. It must be empirically proven during implementation that Next.js correctly proxies multiple independent cookies (e.g., Auth, Antiforgery, XSRF-TOKEN) and accurately preserves attributes like `SameSite` and `Secure`.

### 2. Antiforgery Token Lifecycle
- **Global Validation:** ASP.NET Core's `AutoValidateAntiforgeryTokenAttribute` will enforce CSRF protection globally on all unsafe browser requests within its MVC filter scope.
- **Synchronizer Token:** The system issues a two-part token: a secure `HttpOnly` cookie set by ASP.NET Core, and a JavaScript-readable request token explicitly echoed as `XSRF-TOKEN`.
- **Anonymous Bootstrapping:** A dedicated, anonymous `GET /api/v1/auth/csrf` endpoint is created. Clients must call this endpoint on a fresh application mount to bootstrap their CSRF tokens before any unsafe operation.
- **Coverage:** Login, registration, public booking, password changes, and logout are all strictly protected. No exceptions are granted for these endpoints.

### 3. Origin/Referer Validation Policy
- **Strict Matching:** The API implements strict, full-origin matching (Scheme + Hostname + Effective Port) for unsafe requests. 
- **Failure Behavior:** If both `Origin` and `Referer` headers are missing or mismatched against a configured explicit allowlist, the request fails closed with `403 Forbidden`.
- **Trusted Proxies:** When deployed behind a load balancer, `ForwardedHeadersMiddleware` must be explicitly configured to trust only the known proxy. Trusted origins must never be derived from arbitrary client-supplied input like `X-Forwarded-Host`.

### 4. Logout and Token Revocation
- **Separation of Concerns:** Antiforgery tokens are independent of the Identity authentication cookie. `POST /api/v1/auth/logout` clears the browser's authentication cookie but does not instantly revoke previously issued antiforgery tokens or immediately invalidate copied sessions across devices.
- **Data Protection:** Rotating Data Protection keys cryptographically invalidates all tokens system-wide and will not be used as a routine user logout mechanism.

### 5. Cookie Settings Matrix (Proposed)
The following matrix is proposed for development and production environments, subject to empirical verification:

| Setting | Local Development (HTTP) | Production (HTTPS) |
| :--- | :--- | :--- |
| **Auth Cookie `Secure`** | `false` | `true` (Mandatory) |
| **CSRF Cookie `Secure`** | `false` | `true` |
| **Auth Cookie `HttpOnly`** | `true` (Mandatory) | `true` (Mandatory) |
| **CSRF Cookie `HttpOnly`** | `false` | `false` |
| **`SameSite`** | `Lax` | `Lax` |
| **Expected Origin** | `http://localhost:3000` | Env var allowlist |
| **Session Expiration** | 14-day sliding | 14-day sliding |

## Unresolved Questions / Verification Items
- The exact lifecycle of token issuance during login and how it interacts with the Next.js proxy.
- Stable persistence of ASP.NET Core Data Protection keys across application restarts.
- The 14-day sliding session expiration policy remains unfinalized until explicitly validated.
- Hosting provider, production domains, and storage mechanism for keys remain deferred.

## Consequences
- Requires an initial `GET /api/v1/auth/csrf` request before the first POST operation can occur.
- Enforces strict security boundaries on the backend rather than relying solely on the frontend.
- Antiforgery tokens and strict Origin/Referer validation provide defense in depth against CSRF, including login CSRF risks. They do not independently prevent automated spam or guarantee protection against every login-CSRF scenario.
