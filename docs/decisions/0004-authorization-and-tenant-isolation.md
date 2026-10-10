# ADR-0004: Authorization and Tenant Isolation

**Status:** Approved

## Context
BookFlow requires an explicit authorization model governing public guests, business owners, and platform administrators. Specifically, the system must enforce strict tenant data isolation, clearly define cross-tenant request behaviors, and manage access dynamically when an administrator deactivates a business. The implementation must guarantee isolation using both application-level authorization and database-level integrity without relying on a distributed cache.

## Decision

### 1. Account-Management Exemptions
- **Policy:** `POST /api/v1/auth/logout` and `POST /api/v1/auth/change-password` are explicitly exempt from the inactive-business mutation block.
- **Rationale:** A business owner whose business is deactivated must still be able to secure their account (change password) and end their session (logout).
- **Constraint:** This exemption does not bypass standard authentication rules, CSRF protection, or valid password enforcement.

### 2. Authoritative Activation State Evaluation
- **Policy:** `Business.IsActive` must be evaluated against the authoritative SQL Server state (e.g., via EF Core) on every owner business-data mutation request.
- **Rationale:** An active authentication session caches a `ClaimsPrincipal` in an encrypted cookie. Trusting the cached principal or client-supplied inputs delays enforcement until the session expires. A direct database query reads authoritative SQL Server activation state when evaluated, subject to the explicitly accepted race in Decision 3.
- **Constraint:** Do not introduce distributed caching for this check. The modular-monolith database query suffices.

### 3. Deactivation Race Limitation
- **Policy:** The MVP accepts a microscopic concurrency race. If an owner mutation passes its authoritative `IsActive` check immediately before an administrator's deactivation transaction commits, that single mutation may complete after deactivation.
- **Rationale:** Introducing broad serializable table-locking across all mutation endpoints to prevent this race would severely degrade performance and overcomplicate the MVP. This limitation is accepted and documented. Do not describe this as harmless or as providing absolute immediate enforcement.

### 4. Orphaned Principal Fallback
- **Policy:** If a valid Owner session attempts to access or mutate resources, but the associated `Business` record no longer exists in the database, the API must return `404 Not Found`.
- **Rationale:** Distinguishes an authentication failure (`401`), an unauthorized role (`403`), and a missing tenant context (`404`). The system must not create replacement records or silently grant elevated access.

### 5. Application and Database Dual-Layer Isolation
- **Policy:** Tenant integrity requires a dual-layer approach. The API must execute tenant-scoped application queries and mutations (deriving `BusinessId` solely from the `ClaimsPrincipal`), while the database must enforce composite foreign keys and tenant-scoped unique constraints to mechanically prevent cross-tenant ID leakage.
- **Verification:** Runtime enforcement of both layers must be tested during implementation.

### 6. Admin Scope Authorization
- **Policy:** Administrator authorization (`Admin` role) grants platform-wide scope. Admin endpoint access to businesses is not a cross-tenant violation. In contrast, an Owner accessing another business's resource is a cross-tenant violation resulting in `404 Not Found`.

## Consequences
- Requires a fast database read per mutation to evaluate `IsActive`.
- Preserves the ability to logout or change passwords even when deactivated.
- Explicitly defines the boundary between missing resources (404), unauthenticated access (401), and forbidden access (403).
- The runtime enforcement of these policies remains subject to empirical implementation testing.
