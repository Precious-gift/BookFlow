# 03 Concurrency and Integrity

## Overview

This document outlines the two distinct concurrency protocols required to safely manage BookFlow's dynamic scheduling engine. These protocols are approved at the design level but remain subject to verification through rigorous integration testing.

See [02 Data Model](./02-data-model.md) for entity schemas and relationships.

---

## 1. Booking Concurrency (Double-Booking Prevention)

Appointments do not exist as physical "slots" in the database until they are booked. Thus, optimistic row-versioning on an appointment slot is impossible.

### Strategy: SQL Server Serializable Transactions

To guarantee that two customers cannot book the exact same dynamic time slot simultaneously, booking creation requires a **Serializable** isolation level transaction.

1. **Transaction Boundary:** The transaction begins before the overlap query and commits immediately after the `Appointment` insert.
2. **Overlap Predicate:** The application executes a query checking for existing appointments that overlap the requested time bounds and are *not* cancelled:
   `NewStart < ExistingEnd AND NewEnd > ExistingStart AND Status IN ('Pending', 'Confirmed', 'Completed')`
3. **Insertion:** If 0 overlapping records are found, the new `Appointment` is inserted.

### Error Handling and Retries

Under `Serializable` isolation, concurrent overlapping requests will cause SQL Server to issue range locks. If conflicts occur, SQL Server will select a victim and throw a deadlock exception (Error 1205).
- The application must catch transient deadlock exceptions and execute a bounded retry strategy.
- Rescheduling an appointment uses the exact same transactional boundary and overlap query for the new target time slot.

### Required Integration Tests (Implementation Verification)

This strategy cannot be considered complete until the following integration tests pass against a real SQL Server instance:
- **Concurrent Overlapping Bookings:** Fire numerous simultaneous requests for the exact same slot. Exactly one must succeed.
- **Concurrent Non-Overlapping Bookings:** Fire simultaneous requests for adjacent slots; all must succeed without infinite blocking.
- **Deadlock Recovery:** Force a deadlock to verify bounded retries recover gracefully.
- **Rescheduling Integrity:** Verify rescheduling atomically locks the new slot and releases the old.

---

## 2. Schedule Mutation Concurrency

Changes to a business's `WorkingPeriod` or `UnavailablePeriod` redefine the absolute availability of the business. If concurrent requests modify the schedule, they must not validate against stale data and bypass overlap checks.

### Strategy: Parent Business RowVersion Updates

A `RowVersion` on an individual child period cannot prevent the insertion of overlapping periods. Therefore, we utilize the parent `Business.RowVersion` (a genuine SQL Server `rowversion` column).

1. **Atomic Relationship:** Every mutation (insert, update, or delete) to a `WorkingPeriod` or `UnavailablePeriod` must conditionally update the parent `Business` row within the same transaction.
2. **Protocol Requirement:**
   - The application retrieves the `Business` (and its `RowVersion`) alongside existing schedule periods.
   - Schedule overlap validation is performed in memory.
   - The application mutates the child periods and **explicitly marks the `Business` entity as modified**.
   - EF Core executes `SaveChanges`.
3. **Conflict Detection & Rollback:** EF Core issues the command `UPDATE Business ... WHERE RowVersion = @OriginalRowVersion`. If a concurrent request already modified the schedule, the `RowVersion` will have changed, the update will fail, and EF Core will throw a `DbUpdateConcurrencyException`. The implicit transaction completely rolls back all child schedule mutations safely.

### Required Integration Tests (Implementation Verification)

- **Simultaneous Insertions:** Fire concurrent overlapping `WorkingPeriod` inserts. Exactly one must succeed.
- **Simultaneous Deletions & Updates:** Fire concurrent requests attempting to modify and delete the same periods.
- **No Partial Commits:** Verify that a caught concurrency exception leaves absolutely zero orphaned or partial child records in the database.

*Note: No alternative code path or schedule mutation entry point is permitted to bypass this protocol.*
