# ADR-0006: Validation, Error Handling, and Security Boundaries

**Status:** Approved

## Context
Phase 6.5 requires explicit finalization of the API error contract, payload limits, rate limiting, and safe logging practices. The API must provide consistent error responses without exposing internal server state, ensure robust validation limits that align with the database schema, and mitigate denial-of-service vectors such as unbounded queries and oversized payloads.

## Decision

### 1. HTTP Status 400 for Validation
- **Policy:** The API strictly retains `400 Bad Request` with RFC 7807 Problem Details for all field-level validation errors and business-rule validation failures.
- **Rationale:** Aligns with standard ASP.NET Core MVC default pipelines. Introducing `422 Unprocessable Entity` would require custom filters and create competing conventions within the MVP. `errors` keys are serialized as `camelCase`.

### 2. String Validation Limits
- **Policy:** API validation limits must align with both existing database schema constraints and newly approved product requirements:
  - **Existing Schema Constraints:**
    - `Customer.Name`: Max 100 characters.
    - `Customer.Notes`: Max 2000 characters.
  - **Proposed MVP Constraints (Requiring Schema Alignment):**
    - `Business.Name`: Max 100 characters.
    - `Business.Slug`: Max 100 characters; lowercase ASCII letters (`a-z`), digits (`0-9`), and hyphens (`-`). A single hyphen may separate alphanumeric segments. Leading, trailing, and consecutive hyphens are prohibited.
    - `ApplicationUser.Email`: Max 256 characters. This is currently a framework-derived assumption based on standard Identity limits, not a verified database constraint.
- **Rationale:** Prevents EF Core `DbUpdateException` truncation errors from resulting in unhandled `500` server errors. Implementation must verify and align Identity configuration, EF Core model configuration, database column length, and API validation with the newly approved proposed constraints.

### 3. Pagination & Payload Limits
- **Policy:** 
  - **Pagination:** List endpoints strictly enforce a maximum `pageSize` of 100. Values above 100 or below 1 return `400 Bad Request`. Unbounded queries are not permitted.
  - **Payload Size:** All request endpoints reading a JSON body enforce a strict `1 MB` payload limit. Requests exceeding this limit return `413 Payload Too Large`.
- **Rationale:** Prevents application memory exhaustion and unbounded database queries. `1 MB` is sufficient for schedule updates (arrays of periods) and profile updates.

### 4. Rate Limiting
- **Policy:** The following proposed MVP starting policy applies built-in ASP.NET Core rate limiting to critical endpoints, returning `429 Too Many Requests` when limits are exceeded:
  - **Login:** 5 requests per minute per client IP.
  - **Registration:** 5 requests per hour per client IP.
  - **Public booking creation:** 10 requests per minute per client IP.
- **Partitioning & IP Extraction:** The partitioning key is the Client IP. Extracting the client IP must use forwarded headers (`X-Forwarded-For`) only when the immediate proxy chain (e.g., Next.js) is explicitly trusted and configured via `ForwardedHeadersMiddleware`. Arbitrary client-supplied `X-Forwarded-For` values must never be trusted. Numeric limits must be configurable, not hard-coded.
- **Accepted Constraint:** In a multi-instance topology, built-in rate limits are per-process and will sum together. This is an acceptable trade-off for the MVP phase. Redis or external distributed infrastructure is explicitly excluded for the MVP.
- **Implementation Verification:** Automated tests are required during implementation to verify enforcement, IP partitioning, spoofed-header handling, and the `429` response behavior. The configuration and these tests have not yet been implemented.

### 5. Logging and Error Safety
- **Policy:** 
  - **Payloads:** Request and response bodies are NOT logged by default.
  - **Secrets:** Passwords, authentication cookies, antiforgery tokens, customer PII, and internal secrets are strictly excluded or redacted.
  - **500 Errors:** Unhandled exceptions return a generic Problem Details message. SQL details, stack traces, and internal exception messages are NEVER exposed to the client.
  - **Traceability:** The system uses standard correlation identifiers and operational metadata (status, duration, route) for diagnostics.

## Consequences
- Requires configuration of ASP.NET Core Request Size Limits and Rate Limiting Middleware.
- Guarantees alignment between HTTP status codes and existing API contracts without rewriting standard .NET behaviors.
- Solidifies security boundaries against accidental PII and secret exposure in application logs.
