# BookFlow

BookFlow is an appointment booking and lightweight customer relationship management (CRM) platform designed for independent, single-operator service businesses.

## Project Status

**Stage:** Project foundation and documentation

BookFlow is currently being prepared as an academic software engineering project. Application features will be implemented in subsequent development stages.

## Objectives

- Allow customers to request appointments without creating an account.
- Help business owners manage services, availability, appointments, and customer records.
- Provide appointment status tracking and a dashboard for daily operations.
- Provide a separate administrative portal for basic platform management.

## Target Users

- **Business Owner:** Manages business information, services, availability, appointments, and customer records.
- **Customer:** Browses available services and submits an appointment request without registering.
- **Platform Administrator:** Oversees registered businesses and basic platform activity.

## Planned Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, TanStack Query
- **Backend:** ASP.NET Core Web API (.NET 8), Entity Framework Core
- **Database:** Microsoft SQL Server
- **API:** REST with OpenAPI/Swagger documentation

## Repository Structure

```text
BookFlow/
├── docs/
│   ├── requirements/
│   ├── specifications/
│   ├── architecture/
│   ├── decisions/
│   └── project-management/
├── ui-ux/
│   ├── design-system/
│   ├── screens/exports/
│   └── flows/
├── frontend/
├── backend/
└── tests/
```

## Product Scope

The MVP focuses on appointment requests, service management, availability management, lightweight CRM, and basic platform administration.

Online payments, customer accounts, multi-staff scheduling, native mobile applications, and advanced analytics are outside the current MVP scope.

## Documentation

Product requirements, the authoritative Minimum Viable Technical Specification (MVTS), architecture decisions, and UI/UX implementation guidance will be maintained in this repository.

## Development

Development instructions will be added when the frontend and backend applications are established.

## Project Principles

- Treat the approved MVTS as the source of truth for product requirements.
- Keep implementation aligned with the documented UI/UX foundation.
- Document significant architectural decisions and scope changes.
- Do not commit secrets, credentials, or production environment files.
