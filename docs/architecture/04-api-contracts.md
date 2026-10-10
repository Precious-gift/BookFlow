# 04 API Contracts

**Status:** Draft — Phase 6.3.5 (Includes Admin API), awaiting full API design completion.

## Overview

This document defines the API contracts for the ASP.NET Core backend. It serves as the design foundation before implementation. 

*Note: The unauthenticated public booking API is defined in Section 2. The authenticated owner API contracts, including API-wide CSRF/antiforgery mitigation and strong ETag concurrency rules, are defined in Section 3. Admin management contracts are defined in Section 7.*

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

These endpoints serve the public guest booking flow (`/b/[slug]`). Booking is strictly accountless. Server-side validation must ensure that if the business `IsActive` flag is false, all endpoints in this section return `404 Not Found`.

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

The following endpoints are protected and require the Owner authorization role, except where noted as Public. All mutating operations (POST, PUT, DELETE) must be server-side rejected if the business `IsActive` flag is false.

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

## 4. Owner Appointment Management API

These endpoints are protected and require the Owner authorization role. They strictly isolate data to the authenticated owner's `BusinessId`. All mutating operations (e.g., status changes, rescheduling) must be server-side rejected if the business `IsActive` flag is false.

### 4.1 List Appointments
Retrieves a paginated list of appointments for the owner's business. Private CRM notes are explicitly excluded from the list response to minimize sensitive data exposure.

**`GET /api/v1/appointments`**

**Headers:** Returns a strong ETag on the response.

**Query Parameters:**
- `startDate` (Optional, `YYYY-MM-DD`): Inclusive start of the local calendar range.
- `endDate` (Optional, `YYYY-MM-DD`): Inclusive end of the local calendar range.
  - *Validation:* If both dates are omitted, the API defaults to the current calendar month according to the business's `TimeZoneId`. If only one is supplied, or if the range is reversed or malformed, the API returns `400 Bad Request`. *Proposed Decision:* No strict maximum date-range limit is currently defined, pending product approval.
- `status` (Optional, repeated): Filters by appointment status (e.g., `?status=Pending&status=Confirmed`).
- `page` (Optional, integer): 1-indexed page number. Defaults to `1`.
- `pageSize` (Optional, integer): Items per page. Defaults to `50`. *Proposed Decision:* No maximum page size limit is strictly enforced yet, pending performance reviews.
- *Pagination Validation:* Values `< 1` for `page` or `pageSize` return `400 Bad Request`.

**Ordering:** Deterministically ordered by `StartTime` ascending, followed by `Id` ascending as a unique tie-breaker.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "app-uuid",
      "referenceCode": "XK92M",
      "status": "Pending",
      "startTimeUtc": "2024-11-01T13:00:00Z",
      "endTimeUtc": "2024-11-01T14:00:00Z",
      "serviceNameSnapshot": "Standard Consultation",
      "customer": {
        "id": "cust-uuid",
        "name": "Jane Doe",
        "normalizedPhone": "+15550100",
        "isPhoneValid": true
      }
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 50
}
```

### 4.2 Get Appointment Details
**`GET /api/v1/appointments/{id}`**

Returns the full appointment details. Must return `404 Not Found` if the appointment belongs to another business. Private CRM notes are explicitly excluded from this payload.

**Headers:** Returns a strong ETag (e.g., `ETag: "0x00000000000007D1"`) required for concurrent mutations.

**Response (200 OK):**
```json
{
  "id": "app-uuid",
  "referenceCode": "XK92M",
  "status": "Pending",
  "startTimeUtc": "2024-11-01T13:00:00Z",
  "endTimeUtc": "2024-11-01T14:00:00Z",
  "serviceNameSnapshot": "Standard Consultation",
  "servicePriceSnapshot": 100.00,
  "serviceDurationSnapshot": 60,
  "customer": {
    "id": "cust-uuid",
    "name": "Jane Doe",
    "normalizedPhone": "+15550100",
    "isPhoneValid": true,
    "email": "jane@example.com"
  }
}
```

### 4.3 Update Appointment Status
**`PUT /api/v1/appointments/{id}/status`**

Transitions the appointment status.

**Headers:** Requires the exact strong ETag in `If-Match`.

**Request Payload:**
```json
{
  "status": "Confirmed"
}
```

**Validation Rules:**
- **Lifecycle Constraints:**
  - `Pending` ➔ `Confirmed` or `Cancelled`.
  - `Confirmed` ➔ `Completed` or `Cancelled`.
  - `Cancelled` and `Completed` are terminal states.
- Returns `400 Bad Request` for unsupported transitions.
- **Idempotency:** Repeating a request for the appointment's current status is explicitly idempotent. It will return `200 OK` (success) without altering the database record.
- **Concurrency Strategy:** Uses a genuine SQL Server `rowversion` concurrency token for the database write, automatically exposing a strong ETag on representations.
  - Missing `If-Match`: Returns `428 Precondition Required`.
  - Stale ETag: Returns `412 Precondition Failed`.

### 4.4 Reschedule Appointment
**`PUT /api/v1/appointments/{id}/reschedule`**

Updates the start time of an existing appointment.

**Headers:** Requires the exact strong ETag in `If-Match`. Missing `If-Match` returns `428 Precondition Required`. Stale ETag returns `412 Precondition Failed`.

**Request Payload:**
```json
{
  "startTimeUtc": "2024-11-02T15:00:00Z"
}
```

**Validation and Integrity Rules:**
- **Status Constraints:** Only `Pending` and `Confirmed` appointments can be rescheduled. Returns `400 Bad Request` otherwise.
- **Duration Snapshot:** The new `endTimeUtc` is calculated using the original `ServiceDurationSnapshot` stored on the appointment. It strictly does *not* use the service's current duration.
- **Temporal & Overlap Validation:** The new `startTimeUtc` is interpreted against the business's `TimeZoneId`. The requested slot is validated against working periods, unavailable periods, and overlap rules.
- **Self-Exclusion:** The appointment being rescheduled must be excluded from its own overlap query.
- Returns `409 Conflict` if the requested slot is unavailable.
- Preserves the appointment identity, customer relationship, and all financial/duration snapshots.
- **Concurrency Strategy:** Enforces optimistic concurrency using the `rowversion` token for the atomic write.
- *Unresolved / Integration Requirement:* The exact transaction boundaries and SQL Server concurrency scenarios for competing reschedules must be empirically tested during implementation; this design document cannot claim empirical verification without executed tests.

## 5. Owner CRM API

These endpoints are protected (Owner role) and enforce strict tenant isolation. CRM notes are private and restricted to the authenticated owner. Mutating operations (e.g., updating profiles) must be server-side rejected if the business `IsActive` flag is false.

### 5.1 List Customers
**`GET /api/v1/customers`**

**Query Parameters:**
- `page` (Optional, integer): Defaults to `1`.
- `pageSize` (Optional, integer): Defaults to `50`.
  - *Validation:* Values `< 1` for `page` or `pageSize` return `400 Bad Request`.

**Ordering:** Deterministically ordered by `Name` ascending, followed by `Id` ascending as a tie-breaker.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "cust-uuid",
      "name": "Jane Doe",
      "normalizedPhone": "+15550100",
      "isPhoneValid": true,
      "email": "jane@example.com"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 50
}
```
*(Note: Private CRM notes are excluded from the list response to minimize payloads, but are available in the details endpoint.)*

### 5.2 Get Customer Details
**`GET /api/v1/customers/{id}`**

Returns the customer's CRM profile and appointment history.

**Response (200 OK):**
```json
{
  "id": "cust-uuid",
  "name": "Jane Doe",
  "normalizedPhone": "+15550100",
  "isPhoneValid": true,
  "email": "jane@example.com",
  "notes": "Prefers morning appointments.",
  "appointmentHistory": [
    {
      "id": "app-uuid",
      "startTimeUtc": "2024-10-01T10:00:00Z",
      "status": "Completed",
      "serviceNameSnapshot": "Standard Consultation",
      "servicePriceSnapshot": 100.00
    }
  ]
}
```

### 5.3 Update Customer CRM Profile
**`PUT /api/v1/customers/{id}`**

Allows the owner to update CRM data.

**Request Payload:**
```json
{
  "name": "Jane Doe",
  "phone": "+15550100",
  "email": null,
  "notes": null
}
```

**Validation and Normalization Rules:**
- **Replacement Semantics:** This is a complete replacement of the editable CRM profile. Required fields must be present and non-null. Optional fields (`email`, `notes`) are cleared when omitted from the payload or explicitly set to `null`.
- `name` is enforced at a maximum of 100 characters.
- `notes` is optional and enforced at a maximum of 2,000 characters.
- **Phone Processing:** Valid phone inputs are strictly normalized to E.164. Invalid inputs use the deterministic fallback, setting `IsPhoneValid = False`.
- **Uniqueness Protection:** Evaluates the `UNIQUE (BusinessId, NormalizedPhone, IsPhoneValid)` constraint. If the update results in a collision, the API returns `409 Conflict`. The system must never silently merge customer records or reassign history.

## 6. Dashboard Metrics API

Returns key performance indicators for the owner portal (FR-30). Tenant-scoped.

**`GET /api/v1/dashboard/metrics`**

**Response (200 OK):**
```json
{
  "todayAppointments": 5,
  "upcomingAppointments": 12,
  "totalCustomers": 150,
  "completedAppointments": 340
}
```

**Metric Definitions & Proposed Interpretations:**
- `todayAppointments`: Appointments starting on the current calendar date in the business's local time zone, excluding `Cancelled` statuses.
- `upcomingAppointments`: Future appointments with `Pending` or `Confirmed` status. "Future" is determined by comparing the appointment start time against the current UTC instant.
- `totalCustomers`: Count of all customer records belonging to the business.
- `completedAppointments`: All-time count of appointments in the `Completed` status.
- *Rationale / Approval Required:* These specific criteria are proposed interpretations of the general FR-30 requirement ("executive dashboard metrics"). They must be approved by product stakeholders as they represent business logic decisions rather than explicit MVTS rules.
- The endpoint safely returns `0` where appropriate and does not expose raw PII.

## 7. Administrator Management API

These endpoints are protected and require the `Admin` authorization role. They provide platform-level oversight and control (FR-34, FR-35, FR-36, FR-37, FR-38).

### 7.1 Cross-Cutting Administrator Rules
- **Authorization:** Server-side enforcement of the `Admin` role is mandatory. Standard `Owner` role endpoints cannot be used to gain admin access, and admin authentication must be strictly isolated.
- **Account Provisioning:** *Unresolved Product Decision:* The MVTS does not define a self-service or CLI workflow for creating the initial administrator account. This must be clarified before implementation.
- **Tenant Scope:** Administrator endpoints have a platform-wide scope, overriding the strict tenant isolation of the Owner API to allow oversight.

### 7.2 Retrieve Platform Metrics
Retrieves aggregate platform usage information (FR-34, FR-38).

**`GET /api/v1/admin/metrics`**

**Headers:** Requires `Admin` authorization.

**Response (200 OK):**
```json
{
  "totalRegisteredBusinesses": 120,
  "activeBusinesses": 115,
  "totalCustomers": 4500,
  "totalAppointments": 12500
}
```
**Definition & Audit Implications:**
- `activeBusinesses`: Count of businesses where `IsActive` is true.

### 7.3 List Businesses
Searches, filters, and paginates registered businesses (FR-35).

**`GET /api/v1/admin/businesses`**

**Headers:** Requires `Admin` authorization. Returns a strong ETag.

**Query Parameters:**
- `searchTerm` (Optional, string): Searches business name or slug.
- `status` (Optional, string): Filters by business status (e.g., `Active`, `Inactive`).
- `page` (Optional, integer): Defaults to `1`.
- `pageSize` (Optional, integer): Defaults to `50`.
  - *Validation:* Values `< 1` for `page` or `pageSize` return `400 Bad Request`.

**Ordering:** Deterministically ordered by `Name` ascending, followed by `Id` ascending as a tie-breaker.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "biz-uuid",
      "name": "Acme Services",
      "slug": "acme-services",
      "isActive": true,
      "ownerEmail": "owner@acme.com"
    }
  ],
  "totalCount": 120,
  "page": 1,
  "pageSize": 50
}
```

### 7.4 Get Business Details
Retrieves detailed profile, owner info, and usage metrics for a specific business (FR-36).

**`GET /api/v1/admin/businesses/{id}`**

**Headers:** Requires `Admin` authorization. Returns a strong ETag.

**Response (200 OK):**
```json
{
  "id": "biz-uuid",
  "name": "Acme Services",
  "slug": "acme-services",
  "isActive": true,
  "timeZoneId": "America/New_York",
  "owner": {
    "id": "owner-uuid",
    "email": "owner@acme.com"
  },
  "metrics": {
    "totalCustomers": 150,
    "totalAppointments": 340
  }
}
```
**Validation:**
- Returns `404 Not Found` if the business ID does not exist.

### 7.5 Update Business Status
Activates or deactivates a business account (FR-37).

**`PUT /api/v1/admin/businesses/{id}/status`**

**Headers:** Requires `Admin` authorization, CSRF token via `X-XSRF-TOKEN`, and `If-Match` with exact strong ETag.

**Request Payload:**
```json
{
  "isActive": false
}
```

**Validation and Integrity Rules:**
- **Authorization:** Requires `Admin` role.
- **Not Found:** Returns `404 Not Found` for invalid business IDs.
- **Idempotency:** Repeating a request for the business's current status is explicitly idempotent. It returns `200 OK` without altering the database.
- **Business State & Impact:**
  - *Approved MVP Product Decision:* Deactivation impacts the platform as follows (clarifying FR-37):
    - **Public Booking:** A deactivated business's public booking page and public booking endpoints return `404 Not Found`. New public bookings are prohibited.
    - **Data Preservation:** Existing appointments, customer records, and appointment history are preserved. Deactivation does not automatically cancel appointments or send notifications.
    - **Owner Access:** Owners of deactivated businesses retain read-only access to historical business records upon authentication. Mutating owner operations (e.g., service changes, availability changes, appointment updates/rescheduling, and CRM updates) are denied while the business is inactive.
    - **Admin Access:** Administrator access to business details and activation controls remains fully available.
    - **Enforcement:** Enforcement must be server-side; hiding frontend controls is insufficient.
- **Concurrency:** Requires strong ETag matching using `rowversion`. Missing `If-Match` returns `428 Precondition Required`. Stale ETag returns `412 Precondition Failed`.

## 8. Deferred and Excluded Endpoints
- **Public Receipt Lookup:** A `GET /bookings/{referenceCode}` endpoint is explicitly excluded. The MVP relies on the `201 Created` response to render the in-app confirmation screen. Exposing an accountless lookup introduces PII enumeration risks that outweigh the UX benefit.
