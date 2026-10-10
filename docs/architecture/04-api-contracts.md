# 04 API Contracts

**Status:** Draft — Phase 6.3.2, awaiting full API design completion.

## Overview

This document defines the API contracts for the ASP.NET Core backend. It serves as the design foundation before implementation. 

*Note: The unauthenticated public booking API is defined in Section 2. The authenticated owner API contracts, including API-wide CSRF/antiforgery mitigation and strong ETag concurrency rules, are defined in Section 3. Admin management contracts remain deferred to subsequent phases.*

## 1. Common API Standards and Error Policy

### Routing and Formats
- **Versioning:** All endpoints are prefixed with `/api/v1/`.
- **Public vs. Protected:** Public guest endpoints are explicitly isolated under `/api/v1/public/b/{slug}`. Authenticated endpoints will reside elsewhere.
- **Casing:** All JSON request and response payloads use `camelCase`.

### Temporal Representation
- **Absolute Instants:** (e.g., Appointment start/end, Unavailable bounds) use strict ISO 8601 UTC strings: `"2024-11-20T14:30:00Z"`.
- **Local Daily Shifts:** (e.g., Working periods) use local clock strings: `"09:00"`, `"17:30"`.
- **Date Ranges:** Use `"YYYY-MM-DD"`.

*See [02 Data Model](./02-data-model.md) for authoritative temporal and timezone rules.*

### HTTP Status Boundaries
- `200 OK` / `201 Created`: Successful operations.
- `400 Bad Request`: Field-level validation (e.g., missing name), invalid date formats, past dates, reversed ranges, or business-rule violations (e.g., attempting to book an explicitly `Inactive` service).
- `404 Not Found`: Resource does not exist, or cross-tenant leakage prevention (e.g., business slug doesn't exist, or `serviceId` belongs to a different business).
- `409 Conflict`: Concurrency conflicts or genuine availability violations (e.g., slot taken).
- `401 Unauthorized` / `403 Forbidden`: *(Provisional for future authenticated routes)*.

### Standard Problem Details
All validation and conflict errors use RFC 7807 Problem Details (ASP.NET Core default).

**Example Validation Error (400):**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "customerName": ["Name is required."],
    "customerPhone": ["A valid phone number is required."]
  }
}
```
*(Implementation note: The backend must ensure `errors` keys are serialized as `camelCase` to align with the frontend. This framework behavior must be verified during implementation.)*

**Example Concurrency Conflict (409):**
```json
{
  "type": "urn:bookflow:booking:conflict",
  "title": "Time slot unavailable",
  "status": 409,
  "detail": "The requested time slot is no longer available. Please select another time."
}
```

## 2. Unauthenticated Public Booking API

These endpoints serve the public guest booking flow (`/b/[slug]`). Booking is strictly accountless.

### 2.1 Retrieve Public Business Profile
Loads branding and timezone data (FR-12). Does not expose `OwnerId` or database concurrency tokens.

**`GET /api/v1/public/b/{slug}`**

**Response (200 OK):**
```json
{
  "name": "Acme Services",
  "slug": "acme-services",
  "timeZoneId": "America/New_York",
  "currencyCode": "USD",
  "currencySymbol": "$",
  "bio": "Professional services...",
  "logoUrl": null
}
```

### 2.2 List Active Services
Populates service selection (FR-13, FR-08). Strictly filters for `IsActive = true`.

**`GET /api/v1/public/b/{slug}/services`**

**Response (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Standard Consultation",
    "durationMinutes": 60,
    "price": 100.00
  }
]
```

### 2.3 Retrieve Available Booking Slots
Calculates bookable time slots (FR-11, FR-14).

**`GET /api/v1/public/b/{slug}/services/{serviceId}/availability`**

**Query Parameters:**
- `startDate` (Mandatory, `YYYY-MM-DD`, inclusive)
- `endDate` (Mandatory, `YYYY-MM-DD`, inclusive)

**Validation and Timezone Rules:**
- **Range Boundaries:** The maximum range is 31 calendar dates, inclusive of both bounds. Reversed ranges (`endDate` before `startDate`), ranges exceeding the limit, malformed dates, and past dates are rejected with `400 Bad Request`.
- **Empty States:** The response's `days` array must include every calendar date in the requested inclusive range. A valid date with no available slots returns `200 OK` with an empty array (`"slots": []`).
- **Inactive Resources:** Returns `404 Not Found` for invalid business/service relationships. Returns `400 Bad Request` if the service is inactive.
- **Daylight Saving (DST):** Uses `Business.TimeZoneId`. Local times falling into a spring-forward invalid gap are omitted. Ambiguous fall-back times are resolved using the standard (post-transition) offset. *Note: Timezone conversion behavior must be explicitly verified on the intended deployment platform (e.g., Linux container vs. Windows host) during implementation.*

**Response (200 OK):**
```json
{
  "timeZoneId": "America/New_York",
  "days": [
    {
      "date": "2024-11-01",
      "slots": [
        { "startTimeUtc": "2024-11-01T13:00:00Z", "endTimeUtc": "2024-11-01T14:00:00Z" }
      ]
    },
    {
      "date": "2024-11-02",
      "slots": [] 
    }
  ]
}
```

### 2.4 Submit Guest Booking Request
Authoritatively creates a Pending appointment (FR-15, FR-16, FR-17, FR-18).

**`POST /api/v1/public/b/{slug}/bookings`**

**Request Payload:**
```json
{
  "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "startTimeUtc": "2024-11-01T13:00:00Z",
  "customerName": "Jane Doe",
  "customerPhone": "+15550100",
  "customerEmail": "jane@example.com"
}
```

**Response (201 Created):**
```json
{
  "referenceCode": "XK92M",
  "status": "Pending",
  "startTimeUtc": "2024-11-01T13:00:00Z",
  "endTimeUtc": "2024-11-01T14:00:00Z",
  "serviceNameSnapshot": "Standard Consultation",
  "servicePriceSnapshot": 100.00
}
```

**Authoritative Booking Validation & Concurrency Rules:**
- **Overlap Prevention:** A previous availability response is merely advisory. This endpoint MUST authoritatively validate that the requested slot fits entirely within valid working periods and does not overlap any unavailable periods or existing appointments.
- **Transaction Guarantee:** This validation must occur within the approved `Serializable` database transaction. If the slot is no longer bookable, the transaction fails and returns a consistent `409 Conflict`. *See [03 Concurrency and Integrity](./03-concurrency-and-integrity.md).* Note: This design requires real SQL Server integration testing during implementation.
- **Cross-Tenant Security:** Validates that `serviceId` belongs to `slug`. 
- **Inactive Resources:** Returns `404 Not Found` for invalid business/service relationships. Returns `400 Bad Request` if the service is explicitly inactive; inactive services must never be bookable.
- **Phone Normalization:** The provided phone number is processed using the approved two-tier strategy: valid numbers are normalized to E.164, and invalid numbers use the deterministic fallback and validity flag. Customer matching relies strictly on the `(BusinessId, NormalizedPhone, IsPhoneValid)` constraint. *See [02 Data Model](./02-data-model.md#customer-matching-and-phone-normalization).*
- **MVP Exclusions:** Name and Phone are required; Email is optional. Customer accounts, payments, and deposits are strictly excluded. The status is forcefully assigned to `Pending`.

## 3. Authentication & Owner Configuration API

The following endpoints are protected and require the Owner authorization role, except where noted as Public.

### 3.1 Cross-Cutting Security Design
- **Authentication Proxy:** Next.js proxies `/api/*` requests to the ASP.NET Core API. The API authoritatively issues `SameSite=Lax` (or `Strict`), `Secure`, `HttpOnly` cookies. The proxy is responsible for forwarding browser `Cookie` headers to the API and forwarding API `Set-Cookie` headers back to the browser. *Implementation Verification:* Cookie paths, forwarding behavior, and domains across the proxy boundary remain unverified and must be explicitly tested.
- **CSRF/Antiforgery:** Because of cookie authentication, the API issues an `XSRF-TOKEN` cookie (non-HttpOnly). The Next.js frontend reads this and echoes it in an `X-XSRF-TOKEN` header on mutating (POST, PUT, DELETE) requests. The API validates the antiforgery token using the selected session-bound mechanism; merely receiving the header is insufficient. Explicit `Origin`/`Referer` validation is required, rejecting missing or invalid origins. *Implementation Verification:* The exact token issuance and validation mechanism must be verified.
- **Tenant Isolation:** Protected endpoints derive the `OwnerId` and `BusinessId` strictly from the authenticated `ClaimsPrincipal`. They never accept `businessId` in URLs or payloads.

### 3.2 Authentication & Account
- **`POST /api/v1/auth/register` (Public):** Requires `email`, `password`, `businessName` (FR-01). The persistence strategy must atomically create both the Identity user and the initial `Business`. If either fails, both must roll back (using a transaction or Identity-compatible persistence approach).
- **`POST /api/v1/auth/login` (Public):** Validates credentials and sets Auth/CSRF cookies (FR-02). (Administrator login follows FR-33).
- **`POST /api/v1/auth/logout`:** Clears cookies (FR-03).
- **`GET /api/v1/auth/me`:** Returns authenticated user profile, including role.
- **`POST /api/v1/auth/change-password`:** Updates password (FR-32). *Scope Decision: Unauthenticated email-based forgotten-password reset is explicitly excluded from the current MVP design pending confirmation against the MVTS. FR-32 establishes password change but does not establish a reset flow.*

### 3.3 Business Profile (FR-04, FR-31)
- **`GET /api/v1/business-profile`:** Returns business `name`, `slug`, `timeZoneId`, `currencyCode`, `currencySymbol`, `bio`, `logoUrl`.
- **`PUT /api/v1/business-profile`:** Updates the profile.
  - `slug` must be globally unique (`409 Conflict` if taken).
  - `currencyCode` and `currencySymbol` must be updated atomically together.
  - Modifying `timeZoneId` alters future availability calculations but does not shift existing UTC `Appointment` bounds.

### 3.4 Service Management (FR-05, FR-06, FR-07, FR-08)
- **`GET /api/v1/services`:** Returns all active and inactive services.
- **`POST /api/v1/services`:** Creates a new service.
- **`PUT /api/v1/services/{id}`:** Fully updates a service, including `isActive`. Hard deletion (`DELETE`) is prohibited. Inactive services are hidden from public booking but preserve historical appointment integrity.

### 3.5 Schedule Mutation (FR-09, FR-10)
Schedule mutation uses a single aggregate endpoint to guarantee atomic locking of the entire schedule against the `Business.RowVersion`.

- **`GET /api/v1/availability`**
  - Returns `workingPeriods` and `unavailablePeriods`.
  - **Headers:** Returns an opaque, strong ETag compatible with HTTP concurrency (e.g., `ETag: "0x00000000000007D1"`). The ETag is treated as an opaque strong validator.

- **`PUT /api/v1/availability`**
  - **Headers:** Requires the exact strong ETag in `If-Match`. The client must return the strong ETag unchanged. Missing precondition header returns `428 Precondition Required`.
  - **Aggregate Replacement Semantics:**
    - Explicitly omitted collection properties leave that collection unchanged.
    - An explicitly empty collection (`[]`) clears all existing records in that collection.
    - Submitting `null` for a collection returns `400 Bad Request`.
    - Existing IDs belonging to the tenant are updated. Omitted IDs within a submitted collection are deleted.
    - Duplicate IDs return `400 Bad Request`.
    - Unknown or cross-business IDs return `404 Not Found`, without exposing another business's data.
    - Any validation or concurrency failure leaves working periods and unavailable periods unchanged.
  - **Atomic Concurrency Guarantee:** All child mutations and the conditional parent `Business.RowVersion` update must execute in one atomic database transaction. Concurrency detection depends on a correctly configured EF Core concurrency token and a concurrency-aware conditional update checking the original SQL Server rowversion. A stale token rolls back all child changes. (Do not assume arbitrary SQL automatically triggers EF Core concurrency exceptions).
  - **Conflict Response:** A stale precondition returns `412 Precondition Failed`.
  - *Implementation Verification:* Real SQL Server integration tests must cover concurrent schedule mutations to verify rollback and ensure no partial commits occur.

## 4. Deferred and Excluded Endpoints
- **Public Receipt Lookup:** A `GET /bookings/{referenceCode}` endpoint is explicitly excluded. The MVP relies on the `201 Created` response to render the in-app confirmation screen. Exposing an accountless lookup introduces PII enumeration risks that outweigh the UX benefit.
- **Owner Dashboard & CRM:** Appointments list/details, status transitions, CRM notes, and owner KPIs (Phase 6.3.4).
- **Admin Management API:** Platform metrics and business oversight (Phase 6.3.5).
