# 02 Data Model

## Overview

This document outlines the approved relational database design for BookFlow, establishing the entities, relationships, tenant isolation strategies, and historical snapshot rules.

## Entity Diagram

```mermaid
erDiagram
    ApplicationUser ||--|| Business : "owns"
    Business ||--o{ Service : "offers"
    Business ||--o{ Customer : "manages CRM"
    Business ||--o{ Appointment : "hosts"
    Business ||--o{ WorkingPeriod : "schedules"
    Business ||--o{ UnavailablePeriod : "blocks"

    Customer ||--o{ Appointment : "books"
    Service ||--o{ Appointment : "is requested for"

    ApplicationUser {
        string Id PK "IdentityUser"
        string Email
    }

    Business {
        guid Id PK
        string OwnerId FK "UNIQUE"
        string Slug UK
        bool IsActive
        string TimeZoneId
        string CurrencyCode
        string CurrencySymbol
        byte[] RowVersion "Concurrency"
    }

    Service {
        guid Id PK
        guid BusinessId FK "Composite UK"
        string Name
        int DurationMinutes
        decimal Price
        bool IsActive
    }

    Customer {
        guid Id PK
        guid BusinessId FK "Composite UK"
        string Name
        string NormalizedPhone
        bool IsPhoneValid
        string Email "Optional"
        string Notes "Optional"
    }

    Appointment {
        guid Id PK
        guid BusinessId FK
        guid CustomerId FK
        guid ServiceId FK
        string ReferenceCode UK_Composite
        datetime StartTime "UTC"
        datetime EndTime "UTC"
        string Status
        string ServiceNameSnapshot
        decimal ServicePriceSnapshot
        int ServiceDurationSnapshot
        byte[] RowVersion "Concurrency"
    }

    WorkingPeriod {
        guid Id PK
        guid BusinessId FK
        int DayOfWeek
        time StartTime
        time EndTime
    }

    UnavailablePeriod {
        guid Id PK
        guid BusinessId FK
        datetime StartDateTime "UTC"
        datetime EndDateTime "UTC"
        string Reason "Optional"
    }
```

## Entity Responsibilities and Ownership

- **ApplicationUser:** Managed by ASP.NET Core Identity. Extends `IdentityUser` and handles authentication and roles (`Owner`, `Admin`).
- **Business:** The core tenant entity. Enforces a **strict 1:1 ownership** via a `UNIQUE` constraint on `OwnerId`. The `IsActive` flag controls the platform-level activation state, distinct from `Service.IsActive`. This governs public discoverability and owner mutation access.
- **Service:** Business offerings containing duration and price.
- **Customer:** A tenant-scoped CRM record created during guest booking.
- **Appointment:** A historical and active booking record capturing the exact temporal and financial state of a service at the time of booking.
- **WorkingPeriod:** Represents daily recurring shifts.
- **UnavailablePeriod:** Represents specific absolute blocked time ranges.

## Tenant Isolation and Composite Foreign Keys

To strictly guarantee that an `Appointment` does not reference a `Customer` or `Service` belonging to a different `Business`, the database employs **Composite Foreign Keys**:
1. `Service` and `Customer` contain a `UNIQUE (Id, BusinessId)` constraint.
2. `Appointment` references these tables using the composite keys: `(ServiceId, BusinessId)` and `(CustomerId, BusinessId)`.
This mechanically guarantees cross-tenant integrity at the SQL Server level.

## Temporal Rules and Time Zones

- **UTC Storage:** All absolute instants in time (`Appointment.StartTime`, `Appointment.EndTime`, and `UnavailablePeriod` bounds) are stored strictly in UTC.
- **Business Time Zones:** `Business.TimeZoneId` stores an explicit IANA time-zone identifier (e.g., `America/New_York`). This guarantees accurate resolution of local daylight-saving time shifts when generating dynamic schedules.
- **Working Periods:** Support split shifts (multiple periods per day). **Overnight shifts within a single record are prohibited.** An overnight shift must be modeled as two separate records split at midnight. `WorkingPeriod.StartTime` and `EndTime` are stored as local clock times (`TIME` type) interpreted against `Business.TimeZoneId`; they are not UTC values.

## Customer Matching and Phone Normalization

Customers book without an account. Identity matching relies strictly on the phone number.
- **Valid E.164 Normalization:** Incoming valid phone numbers are formatted to strict E.164 and stored in `NormalizedPhone`. The `IsPhoneValid` category flag is set to `True`.
- **Invalid Fallback:** Unresolvable inputs are stripped of all non-alphanumeric characters and stored in the same column, with `IsPhoneValid = False`.
- **Tenant-Scoped Uniqueness:** `UNIQUE (BusinessId, NormalizedPhone, IsPhoneValid)`. This prevents valid numbers from ever colliding with or silently merging into uncertain invalid inputs.
- **Corrections:** If an owner updates an invalid phone number to a valid one that already belongs to another CRM record, the database constraint cleanly rejects the update, requiring explicit manual CRM deduplication rather than silent data corruption.
- **Optional Email:** Email is strictly optional at booking but can be updated later via the CRM by the owner.

## Customer CRM Data

In addition to identity matching, the `Customer` entity stores CRM data:
- **Name:** Captured during booking. Enforced as `NVARCHAR(100)` at the database and API boundary. While the UI displays this as "Full Name", the canonical data model uses `Name`.
- **Notes:** Optional internal CRM notes managed by the owner, enforced as nullable `NVARCHAR(2000)`. These notes are strictly private CRM data accessible only to the authenticated owner of the tenant business and must never be exposed via public booking endpoints.

## Appointment Lifecycle and History Preservation

- **Statuses:** `Pending`, `Confirmed`, `Completed`, `Cancelled`.
- **Transitions:** `Pending` ➔ `Confirmed` or `Cancelled`. `Confirmed` ➔ `Completed` or `Cancelled`.
- **Reference Codes:** Short random alphanumeric strings generated with a bounded retry loop, enforced by `UNIQUE (BusinessId, ReferenceCode)`.
- **Snapshots:** The service name, price, and duration are snapshotted onto the `Appointment` at booking time to preserve historical accuracy even if the service is later modified.
- **Deletions (RESTRICT):** To preserve CRM and appointment history, foreign-key deletion behavior from `Appointment` to `Service` and `Customer` is set to **RESTRICT**. Services are removed via `IsActive = false` (deactivation), which blocks new bookings while preserving all existing historical records.

## Currency Consistency

To comply with FR-31 while ensuring financial consistency, `Business` stores both `CurrencyCode` (e.g., `USD`) and `CurrencySymbol` (e.g., `$`). These must be updated together atomically; they cannot fall out of sync.

## See Also
- [03 Concurrency and Integrity](./03-concurrency-and-integrity.md)
