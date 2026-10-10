# ADR-0005: Administrator Provisioning

**Status:** Approved

## Context
BookFlow requires an explicit mechanism to securely provision the initial Platform Administrator account (FR-33) without introducing public administration endpoints, exposing secrets in source control, or creating concurrency vulnerabilities during application startup.

## Decision

### 1. Identity-Based Initialization
- **Policy:** The application will use a controlled, repeatable ASP.NET Core Identity initialization process executing `RoleManager` and `UserManager` commands to ensure the `Owner` and `Admin` roles exist and to provision the initial Admin user.
- **Rationale:** Groups role and user creation into a single, testable C# block, avoiding race conditions and complexity associated with mixing EF Core database migrations and user creation logic.

### 2. Protected Configuration
- **Policy:** Initial Admin credentials (email and password) must be read from protected external configuration (e.g., Environment Variables or Azure Key Vault). Credentials or password hashes must never be embedded in source control or EF Core migrations.

### 3. One-Time Safeguard and Ambiguity Fallback
- **Policy:** Before creating the initial Admin, the process must check whether any user already holds the `Admin` role. If one exists, the process skips user creation and does not reset passwords. If provisioning encounters an ambiguous or unsafe state, it must fail safely and require operator intervention rather than risking duplicate creation or credential resets.

### 4. Bootstrap Secret Lifecycle and Password Rotation
- **Policy:** The initial Admin is operationally required to log in and change their password promptly via the standard `/api/v1/auth/change-password` endpoint. The platform operator is required to remove the bootstrap credentials from the deployment configuration once provisioning succeeds.
- **Safeguard:** A lingering bootstrap secret cannot reset passwords or create additional accounts due to the one-time safeguard check.

### 5. Recovery and Future Management Boundary
- **Policy:** Public Admin creation, deletion, demotion, or recovery endpoints are explicitly excluded from the MVP.
- **Recovery:** Admin password recovery is a controlled, operator-authorized procedure requiring administrative access to ASP.NET Core Identity tooling or backend interfaces (e.g., a secured CLI tool or script interacting with Identity). Direct SQL password-hash injection and automatic environment-variable-triggered resets are explicitly prohibited.

### 6. Concurrent Startup
- **Policy:** Concurrent application startup is a security-sensitive condition. Implementation must explicitly prevent duplicate or conflicting initial Admin accounts from being provisioned if multiple instances start simultaneously against an empty database. The simple existence check alone does not solve concurrency.

### 7. Diagnostics and Auditability
- **Policy:** Dedicated audit tables and UIs are out of MVP scope. Application logs may record the outcome of the provisioning process for operational diagnostics but must strictly never log passwords, hashes, tokens, or other secrets.

## Consequences
- Requires careful integration of the Identity initialization block into the application startup sequence.
- Demands empirical verification of concurrent startup behavior to guarantee safe initialization.
- Replaces complex UI-based recovery with secure, operator-driven recovery mechanisms.
