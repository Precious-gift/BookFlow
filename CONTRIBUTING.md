# Contributing to BookFlow

## Before Making Changes

1. Read `README.md`.
2. Consult the authoritative MVTS in `docs/specifications/`.
3. Consult `ui-ux/design-system/AUTHORITATIVE_FOUNDATION_v1.1.md` for UI/UX decisions.
4. Check for existing documentation and avoid duplicating it.

## Branching

Use `main` as the stable integration branch.

Create a short-lived branch for each focused change:

- `feature/<short-description>` — new functionality
- `fix/<short-description>` — bug fixes
- `docs/<short-description>` — documentation changes
- `chore/<short-description>` — maintenance and tooling
- `test/<short-description>` — test changes

Examples:

- `docs/requirements-index`
- `feature/appointment-booking`
- `fix/availability-validation`

Do not develop substantial features directly on `main`.

## Commit Messages

Use a concise Conventional Commits style:

- `feat: add appointment booking`
- `fix: prevent overlapping appointments`
- `docs: clarify booking requirements`
- `test: cover appointment validation`
- `chore: configure project tooling`
- `refactor: simplify availability service`

Keep commits focused and describe the actual change.

## Pull Requests and Reviews

Before merging:

1. Summarize the change and its purpose.
2. Link relevant requirements or decisions when applicable.
3. Run relevant checks and tests.
4. Identify known limitations or incomplete work.
5. Confirm no secrets or unrelated files are included.

For solo work, use the same checklist when reviewing your own branch.

## Security and Configuration

- Never commit passwords, API keys, access tokens, or real credentials.
- Keep local environment files out of Git.
- Provide safe example configuration files when needed.
- Review staged changes before committing.
- Do not disable security checks merely to make a build pass.

## Documentation and Scope

Update documentation when behavior, architecture, configuration, or approved requirements change. Do not silently expand the MVP beyond the authoritative specification.

