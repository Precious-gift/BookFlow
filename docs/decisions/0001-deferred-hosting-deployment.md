# ADR 0001: Deferred Hosting and Deployment Architecture

## Context
BookFlow is an academic MVP project with defined functional requirements (MVTS v1.1). While the technology stack (Next.js, ASP.NET Core 8 Web API, SQL Server) is strictly specified, the final hosting providers and exact deployment topology (e.g., Vercel + Azure App Service, Docker containers, etc.) have not been finalized.

Attempting to finalize hosting at this stage risks premature optimization and distraction from core domain and database design implementation.

## Decision
We will **defer** the final hosting and deployment architecture decision to a later phase (likely post-API implementation).

## Status
**Deferred**

## Alternatives Considered

No hosting provider or deployment topology has been formally evaluated or rejected at this stage. Candidate options that may be considered during the resolution phase include:

- A combined cloud platform (e.g., frontend and API deployed to the same provider).
- Separate providers for the frontend (e.g., a static/SSR host) and the API (e.g., a managed container or PaaS service).
- A self-hosted or institutional environment appropriate for academic demonstration.

This list is provided for completeness and does not constitute a preference, a commitment, or a rejection of any option. The choice will be made when hosting requirements are understood.

## Safe Assumptions for Development Planning
While deployment is deferred, the following assumptions are safe for ongoing development and architectural planning:
1. **CORS and API Proxying:** The Next.js frontend will use local rewrites (`next.config.js`) to proxy `/api/*` traffic to the .NET API. This avoids CORS complexity in local development and aligns cleanly with issuing first-party HTTP-only cookies.
2. **Environment Configuration:** Both applications must strictly utilize environment variables for all secrets, connection strings, and base URLs, ensuring portability across any eventual deployment provider.
3. **Database Portability:** EF Core Code-First migrations will be used, ensuring the SQL Server schema can be reliably deployed to any provider (Azure SQL, AWS RDS, or a local container).

## Resolution
This decision must be resolved prior to the final academic demonstration phase, once the application is functionally complete locally.
