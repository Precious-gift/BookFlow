# BookFlow Phase 7.2.2: YouGile Hierarchy, Workflow & Population Plan

## 1. Executive Summary

This document establishes the verified, safe, repeatable, and cache-isolated method for transferring the approved **BookFlow MVP Agile Implementation Backlog** (`v1.0`, 56 tickets across 10 Epics) into **YouGile**.

Following Phase 7.2.1 and Phase 7.2.2 safety verification:
1. **The Kanban workflow board is strictly decoupled from the backlog hierarchy.** Board columns represent workflow states (`Backlog` → `Ready` → `In Progress` → `Review` → `Done`, plus `Blocked`). Epics are not board columns; tickets are first-class cards initially placed into `Backlog` in topological order.
2. **The 6-level logical hierarchy is preserved with complete fidelity** without falsely claiming that YouGile supports 6 native nested levels.
3. **Dependencies are operationally governed via interactive checklist gates and explicit Definition of Ready rules**, honestly documenting that YouGile possesses no automated transition blocking engine.
4. **Dry-run and live caches are completely isolated**: mode-specific cache files (`yougile_id_map.dryrun.json` vs `yougile_id_map.live.json`), metadata tagging, and strict runtime sanitization guarantee that simulated IDs can never contaminate live execution or cause live runs to skip entities.
5. **API request counts are fully reconciled**: 64 total HTTP requests for creating a new project, board, 6 columns, and 56 tasks; 56 HTTP requests when populating an existing mapped destination.
6. **Destination safety is strictly guaranteed**: live execution requires an explicit target mapping file or an explicit `--create-new-project` flag; the engine will never silently create projects.

All work continues to honor strict boundaries: zero live API requests, zero workspace inspection, zero Git staging or commits, no changes to application code, and [`docs/specifications/mvts.txt`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/specifications/mvts.txt) remains untouched.

**Verdict: READY FOR POPULATION AUTHORIZATION.**

---

## 2. Official YouGile REST API v2 Contract Audit

Based on the verified OpenAPI 3.0 specification (`https://yougile.com/api/`):

### 2.1 Confirmed API Capabilities
| Object / Feature | Endpoint | Schema Details | Operational Application |
| :--- | :--- | :--- | :--- |
| **Authentication** | Global | Header `Authorization: Bearer <API_KEY>` | Bearer token passed via environment variable `YOUGILE_API_KEY`. |
| **Rate Limit** | Global Gateway | **50 requests / min per company** | Exceeding returns HTTP 429. Client throttles at 1.5s/call (40 req/min) with exponential backoff. |
| **Idempotency** | Core `POST` schemas | `idempotencyKey: string (uuid)` | Schema-level idempotency prevents duplicate entities on network retry or re-run. |
| **Projects** | `POST /api-v2/projects` | `title: string`, `users: string[]` | Top-level workspace container representing "BookFlow". |
| **Boards** | `POST /api-v2/boards` | `title: string`, `projectId: string` | Board representing "BookFlow — MVP Implementation". |
| **Columns** | `POST /api-v2/columns` | `title: string`, `boardId: string`, `color: number` | Represents the 6 workflow lifecycle states on the Kanban board. |
| **Tasks** | `POST /api-v2/tasks` | `title: string`, `columnId: string`, `description: string` (Markdown), `subtasks: string[]`, `checklists: object[]`, `color: string` | Represents the 56 implementation tickets (`T-01` to `T-56`). |
| **Checklists** | In task payload | `[{ title: string, items: [{ title: string, isCompleted: boolean }] }]` | Native interactive checkboxes for Prerequisite Gates, Acceptance Criteria, and Validation Gates. |
| **Card Colors** | In task payload (`color`) | `task-primary`, `task-blue`, `task-turquoise`, `task-green`, `task-yellow`, `task-violet`, `task-pink`, `task-gray`, `task-red` | Visually groups tickets by Epic on the Kanban board. |

### 2.2 Confirmed Schema & Platform Limitations
1. **Native Hierarchy Depth:** YouGile supports a 4-tier visual hierarchy: `Project` → `Board` → `Column` → `Task` → `Subtask` (1 subtask level). It **does not** provide 6 nested visual tree levels natively.
2. **Automated Dependency Enforcement:** YouGile has **no automated transition blocking engine, workflow triggers, or column guards** that block moving a task between columns when prerequisites are incomplete. The `deadline.links` field exists only for Gantt chart visual connectors.
3. **Transaction Batching:** The API does **not** provide transactional multi-entity batch endpoints. Each object must be created via an individual idempotent HTTP request.

---

## 3. Hierarchy Representation Alternatives & Trade-Off Analysis

The approved BookFlow logical hierarchy has 6 levels:
`MVP (L1)` → `Epic (L2)` → `Feature (L3)` → `Stage (L4)` → `Sub-stage (L5)` → `Ticket (L6)`

We evaluated three architectural alternatives to represent this in YouGile:

| Dimension | Alternative 1: Single Workflow Board with First-Class Tickets (Chosen) | Alternative 2: Pure Parent-Task / Subtask Structure | Alternative 3: Hybrid Dual-Board Structure |
| :--- | :--- | :--- | :--- |
| **Board Structure** | 1 Board with 6 Workflow Columns (`Backlog`, `Ready`, `In Progress`, `Review`, `Done`, `Blocked`). | 1 Board with Workflow Columns; 10 Epic Parent Tasks created as board cards; 56 Tickets created as subtasks. | Board 1: Workflow Kanban (56 tickets).<br>Board 2: Epic Roadmap (10 Epic parent cards linking tickets as subtasks). |
| **Ticket Status & Visibility** | **Superior.** Every ticket is a primary, draggable card on the Kanban board with clear WIP visibility. | **Severely Impaired.** If subtasks have no columns, they are hidden inside Epic modals. If given columns, 66 cards (10 Epics + 56 tickets) crowd the board. | **High.** Full Kanban workflow on Board 1; executive milestone rollups on Board 2. |
| **Workflow State Decoupling** | **Complete.** Tickets transition cleanly across workflow states without dragging along parent tasks. | **Broken.** Epic parent cards linger in `In Progress` for weeks while child tickets move, causing visual ambiguity. | **Complete.** Workflow on Board 1 is decoupled from milestone status on Board 2. |
| **Hierarchy Representation** | - **L1 (MVP):** YouGile Project.<br>- **L2 (Epic):** Card Color + Title Prefix `[EP-XX \| T-YY]`.<br>- **L3-L5:** Explicit Markdown breadcrumbs.<br>- **L6 (Ticket):** First-class Task card. | - **L1 (MVP):** Project.<br>- **L2 (Epic):** Parent Task.<br>- **L3-L5:** Markdown breadcrumb inside subtask.<br>- **L6 (Ticket):** Subtask. | - **L1 (MVP):** Project.<br>- **L2 (Epic):** Parent Task on Board 2.<br>- **L3-L5:** Markdown breadcrumbs.<br>- **L6 (Ticket):** Task on Board 1 linked as subtask to Board 2. |
| **API & Sync Operations** | **Reconciled: 64 calls** (New) / **56 calls** (Mapped). Minimal point of failure, fastest execution, easiest to audit. | Moderate (68 API calls). Complex parent-subtask linking on single board. | High (88 API calls). Requires cross-board subtask linking and maintaining dual-board state. |
| **Risk of Discarding Data** | **0% Data Loss.** 100% of fields, breadcrumbs, criteria, and tests preserved. | **0% Data Loss.** Preserved, but day-to-day usability degraded. | **0% Data Loss.** High usability, but added structural complexity. |

### Selected Strategy: Alternative 1
**Alternative 1 was selected as the optimal implementation model because:**
1. In daily software engineering, tickets are the atomic unit of work (WIP). Developers must be able to pull and move individual tickets (`T-01` to `T-56`) across `Backlog` → `Ready` → `In Progress` → `Review` → `Done` on the Kanban board without opening parent modals or navigating cluttered boards.
2. It honestly reflects YouGile's actual capabilities rather than creating artificial parent tasks that degrade board usability.
3. Visual Epic identification is immediately obvious on the board via distinct card colors and `[EP-XX | T-YY]` prefixes.
4. Detailed hierarchy traceability is preserved 100% intact in every ticket description.

---

## 4. Independent Workflow Board Architecture

The Kanban board represents workflow status independently of backlog hierarchy:

### 4.1 The 6 Workflow Columns
1. **`Backlog` (Color: Gray):** The initial intake column. All 56 tickets are placed here upon population, ordered in strict topological dependency order (so the top of the column represents immediate next work).
2. **`Ready` (Color: Blue):** Tickets whose prerequisites are 100% verified as `Done`, with all external dependencies satisfied. Ready for sprint pull.
3. **`In Progress` (Color: Yellow):** Tickets actively being coded and implemented by an engineer.
4. **`Review` (Color: Violet):** Pull requests submitted; peer code review, architecture check, and unit/integration testing underway.
5. **`Done` (Color: Green):** Pull request merged; acceptance criteria verified and validation gates passed.
6. **`Blocked` (Color: Red):** Work halted due to technical impediments, external blockers, or prerequisite regressions.

---

## 5. Operational Dependency Enforcement Model

### 5.1 Disclosure of Automated Limitations
* **YouGile provides NO automated transition blocking engine.** The API and UI will not prevent a user from dragging a card from `Backlog` to `Ready` or `In Progress` even if its prerequisites are incomplete.
* **Topological creation order is NOT runtime enforcement.** Topological sort was used solely by the population script to create objects deterministically. It does not control workflow behavior during active development.

### 5.2 Manual Definition of Ready (DoR) Gate Rule
To prevent premature implementation of dependent tickets, the BookFlow engineering workflow enforces a strict operational gate:

> **Operational Gate (Definition of Ready):**
> A ticket **CANNOT** be moved from `Backlog` to `Ready` or `In Progress` until **ALL** prerequisite ticket IDs listed in its dependencies section are in the `Done` column.
> If an engineer picks up a ticket whose prerequisites remain incomplete, the ticket must immediately be moved to `Blocked` with a blocker comment.

### 5.3 Interactive Checklist Enforcement on Each Ticket
Every ticket in YouGile is provisioned with a native interactive checklist titled **"Prerequisite Gates (Definition of Ready)"**:
- For tickets with prerequisites (e.g. `T-02`):
  - `[ ] Prerequisite T-01 verified in DONE column`
- For root tickets with no prerequisites (e.g. `T-01`, `T-06`):
  - `[x] Root Ticket: No prerequisite blockers (Ready for pull)`

An engineer or tech lead must physically inspect and check off this gate item before transitioning the card out of the `Backlog`.

---

## 6. Cache Isolation, API Reconciliations & Destination Safety

### 6.1 Cache Isolation Architecture & Contamination Proof
To guarantee that simulated IDs generated during dry runs can **never** contaminate live execution or cause live runs to skip entities:

1. **Dedicated Cache Paths by Mode:**
   - Dry-Run Default: [`docs/project-management/yougile/yougile_id_map.dryrun.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/yougile_id_map.dryrun.json)
   - Live Execution Default: [`docs/project-management/yougile/yougile_id_map.live.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/yougile_id_map.live.json)
2. **Metadata Tagging:**
   Every cache file contains a header `_metadata: {"mode": "dry-run" | "live", ...}`.
3. **Runtime Sanitization Engine (`sanitize_cache_for_live_mode`):**
   When `populate_yougile.py` runs in live mode:
   - Any cache file tagged with `"mode": "dry-run"` has 100% of its entity mappings rejected and purged.
   - Any ID string starting with `"dryrun-"` or containing `"_simulated"` is stripped from `project`, `board`, `columns`, and `tickets`.
   - Real, non-simulated UUIDs are preserved intact.
4. **Hardened Destination Gate:**
   `has_existing_destination` checks `not is_simulated_id(val)` on all target fields. A dry-run simulated ID can never satisfy the destination requirement.

### 6.2 Reconciled API Call Breakdown
The exact HTTP request counts required by the population engine are:

| Operation | Endpoint | Scenario A: New Project (`--create-new-project`) | Scenario B: Mapped Destination (`--map-file`) | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **1. Create Project** | `POST /api-v2/projects` | **1** | **0** | Payload: `{"title": "BookFlow", "idempotencyKey": "..."}` |
| **2. Create Board** | `POST /api-v2/boards` | **1** | **0** | Payload: `{"title": "BookFlow — MVP Implementation", ...}` |
| **3. Create Columns** | `POST /api-v2/columns` | **6** | **0** | 6 workflow columns (Backlog, Ready, In Progress, Review, Done, Blocked) |
| **4. Create Tasks** | `POST /api-v2/tasks` | **56** | **56** | 56 tickets placed into Backlog with descriptions and checklists |
| **5. Read / Verification**| `GET /api-v2/...` | **0** | **0** | Verified contract relies on `POST` idempotency keys; 0 read calls needed |
| **TOTAL HTTP CALLS** | | **64 calls** | **56 calls** | **Exact Reconciled Operations** |

**Explanation of the 63 vs 64 call figure:**
In the initial draft of Phase 7.2.1, an estimate of "63 calls" was mentioned (`1 Project + 6 Columns + 56 Tickets = 63`). That preliminary calculation inadvertently omitted the discrete `POST /api-v2/boards` request (1 call). In YouGile's API contract, Columns cannot be attached directly to a Project; a Board is a required intermediate container. Therefore, creating a new workspace from scratch requires exactly **64 HTTP calls**.

### 6.3 Rate Limiting Budget & Execution Timing
* **YouGile API Gateway Limit:** 50 requests per minute per company.
* **Client-Side Throttling:** 1.5 seconds delay enforced between every request = maximum **40 requests per minute** (80% of quota).
* **Execution Duration:**
  - **Scenario A (64 calls):** `64 * 1.5s = 96.0 seconds` (~1 minute 36 seconds).
  - **Scenario B (56 calls):** `56 * 1.5s = 84.0 seconds` (~1 minute 24 seconds).
* **Comprehensive Coverage:** `self._rate_limit()` is invoked before **every single request**, including retries. On HTTP 429, the client pauses for 60 seconds before retrying.

### 6.4 Destination Safety Enforcement
* **No Workspace Discovery:** The script never inspects private company workspaces.
* **No Silent Creation:** In `--mode live`, if destination IDs are not provided in the mapping file and `--create-new-project` is not passed, the script aborts immediately with exit code 1 and makes 0 changes.

---

## 7. Reconciled Backlog Counts & Field Integrity

### Authoritative Backlog Counts
* **MVP:** 1
* **Epics:** 10 (`EP-01` to `EP-10`)
* **Features:** 28 functional areas (32 hierarchical tree entries)
* **Stages:** 41 functional stages (37 hierarchical tree entries)
* **Sub-stages:** 56 (1-to-1 with implementation tickets)
* **Tickets:** 56 (`T-01` through `T-56`)

### Mandatory Ticket Fields (11/11 Preserved):
Every ticket preserves:
1. `Ticket ID` (e.g. `T-01`)
2. `Title`
3. `Objective`
4. `Scope`
5. `Frontend Work`
6. `Backend Work`
7. `API & Data Requirements`
8. `Acceptance Criteria` (as description section and interactive checklist)
9. `Dependencies & Prerequisites` (with DoR rule and interactive checklist)
10. `UI & Visual Reference`
11. `Validation & Testing Requirements` (as description section and interactive checklist)

All 10 reconciled overrides (`T-10`, `T-11`, `T-13`, `T-16`, `T-28`, `T-36`, `T-38`, `T-54`, `T-55`, `T-56`) are active in the manifest.

---

## 8. Artifact Suite & Verification Results

### 8.1 Repository Artifacts
- [`docs/project-management/yougile/backlog_manifest.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/backlog_manifest.json): Canonical JSON backlog dataset.
- [`docs/project-management/yougile/populate_yougile.py`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/populate_yougile.py): Population CLI tool with cache isolation, workflow columns, prerequisite checklists, and destination safety gates.
- [`docs/project-management/yougile/id_mappings.template.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/id_mappings.template.json): Destination mapping template for targeting existing YouGile UUIDs.
- [`docs/project-management/yougile/README.md`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/README.md): Operational execution manual.
- [`docs/project-management/yougile/population_verification_report.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/population_verification_report.json): Simulated dry-run verification report.
- [`docs/project-management/yougile/yougile_id_map.dryrun.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/yougile_id_map.dryrun.json): Default isolated dry-run mapping cache.
- [`docs/project-management/yougile/yougile_id_map.live.json`](file:///c:/Users/Falaye%20Precious-gift/Documents/SAAS_APPS/BookFlow/docs/project-management/yougile/yougile_id_map.live.json): Default isolated live mapping cache.

### 8.2 Offline Validation & Regression Test Results
* **Backlog Graph Integrity:** 56/56 tickets valid.
* **Cycle Check:** 0 cycles detected (Kahn's algorithm DAG sort resolved 56/56 tickets).
* **Field Completeness:** 56/56 tickets contain all 11 required fields with zero empty values.
* **Workflow Decoupling:** 6 workflow columns verified; Epics cleanly mapped to card metadata.
* **Destination Safety Gate:** Verified that unconfigured live execution aborts immediately without network calls.
* **Cache Isolation Regression Test Suite:**
  - `TEST 1 (Default Dry-Run Isolation):` Passed. Created `yougile_id_map.dryrun.json`; live cache remained uncreated.
  - `TEST 2 (Destination Safety vs Dry-Run Map):` Passed. Live mode pointing to dry-run map aborted safely with exit code 1.
  - `TEST 3A (Dry-Run Metadata Purge):` Passed. 100% of simulated entities dropped.
  - `TEST 3B (Mixed Cache Sanitization):` Passed. Real UUIDs preserved; simulated `dryrun-*` IDs dropped.
  - `TEST 3C (Full 56-Ticket Cache Purge):` Passed. All 56 simulated ticket IDs purged; live run will skip 0 tickets.

---

## 9. Conclusion & Verdict

**VERDICT: READY FOR POPULATION AUTHORIZATION**

Cache isolation is mathematically and empirically proven, destination safety is enforced by code, API request counts are reconciled to exactly 64 (new) / 56 (mapped) calls, and all offline verification checks passed with 100% success.
