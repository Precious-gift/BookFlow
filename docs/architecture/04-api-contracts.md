# 04 API Contracts

**Status:** Draft — Phase 6.3.2, awaiting full API design completion.

## Overview

This document defines the API contracts for the ASP.NET Core backend. It serves as the design foundation before implementation. 

*Note: The unauthenticated public booking API is defined here. The authenticated owner/admin API contracts and CSRF/antiforgery mitigation details will be finalized in subsequent design phases.*

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

## 3. Deferred and Excluded Endpoints

- **Public Receipt Lookup:** A `GET /bookings/{referenceCode}` endpoint is explicitly excluded. The MVP relies on the `201 Created` response to render the in-app confirmation screen. Exposing an accountless lookup introduces PII enumeration risks that outweigh the UX benefit.
- **Owner/Admin API:** Contracts for the business owner dashboard, authentication, service management, and `RowVersion` schedule-mutation concurrency will be designed in subsequent stages.
