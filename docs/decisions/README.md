# Architecture and Product Decisions

This directory records significant architectural and product decisions using individual Architecture Decision Records (ADRs).

Each record describes:

- Context and problem
- Decision and status
- Alternatives considered
- Consequences and trade-offs
- Related requirements

Do not record a proposal as an approved decision until it has been explicitly reviewed and approved.

## Decision Log

| File | Status | Summary |
| :--- | :--- | :--- |
| [0001-deferred-hosting-deployment.md](./0001-deferred-hosting-deployment.md) | Deferred | Hosting and deployment architecture are deferred to a post-implementation phase. Development assumptions are recorded. |
| [0002-authentication-and-session-model.md](./0002-authentication-and-session-model.md) | Approved / Proposed | Defines cookie-backed Identity sessions, shared login endpoint, and owner registration integrity. Proposes 14-day sliding expiration (unfinalized). |
| [0003-csrf-and-proxy-configuration.md](./0003-csrf-and-proxy-configuration.md) | Approved / Verification Needed | Defines Next.js proxy design, CSRF antiforgery lifecycle, Origin/Referer policy, and outlines items needing empirical verification. |
| [0004-authorization-and-tenant-isolation.md](./0004-authorization-and-tenant-isolation.md) | Approved | Defines the authorization model, tenant data isolation policies, account management exemptions, and inactive-business evaluation rules. |
| [0005-administrator-provisioning.md](./0005-administrator-provisioning.md) | Approved | Defines the secure, Identity-based initial provisioning mechanism for the Platform Administrator. |
| [0006-validation-and-error-handling.md](./0006-validation-and-error-handling.md) | Approved | Finalizes validation limits, pagination caps (max 100), payload limits (1MB), built-in rate limiting, and safe logging practices. |
