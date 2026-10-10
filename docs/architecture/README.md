# Architecture Documentation

This directory contains BookFlow architecture documentation established through Phase 6 of the project.

Architecture decisions must remain consistent with the approved MVTS. Proposed changes should be documented before implementation when they materially affect the system.

## Documents

| File | Contents |
| :--- | :--- |
| [01-system-architecture.md](./01-system-architecture.md) | Modular monolith structure, Clean Architecture backend layers, technology stack, route boundaries, authentication direction, tenant isolation, and excluded technologies. |
| [02-data-model.md](./02-data-model.md) | Approved Phase 6.2 entity and relationship design, ownership constraints, composite FKs, appointment lifecycle, phone normalization, and currency rules. |
| [03-concurrency-and-integrity.md](./03-concurrency-and-integrity.md) | Booking concurrency via Serializable transactions, schedule mutation concurrency via `Business.RowVersion`, and required integration test specifications. |

## Related Documents

- [Authoritative MVTS v1.1](../specifications/BookFlow_MVTS_v1.1.docx)
- [Architecture Decisions](../decisions/)
- [Antigravity Implementation Rules](../project-management/ANTIGRAVITY_IMPLEMENTATION_RULES.md)
