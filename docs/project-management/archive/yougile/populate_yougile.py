#!/usr/bin/env python3
"""
BookFlow YouGile Population Tool (Phase 7.2.2)
=============================================
Safe, repeatable, and idempotent population tool for transferring the approved
BookFlow MVP Agile Implementation Backlog into YouGile.

Authoritative Source:
  BOOKFLOW_MVP_BACKLOG_PACKAGE_v1.0.md & docs/project-management/yougile/backlog_manifest.json

Key Principles:
  1. Offline & Safe by Default: Runs in --mode dry-run with ZERO network calls.
  2. Preserves 6-Level Logical Hierarchy: MVP -> Epic -> Feature -> Stage -> Sub-stage -> Ticket.
  3. Clean Workflow Decoupling: Kanban board uses 6 dedicated workflow columns:
     Backlog -> Ready -> In Progress -> Review -> Done, plus Blocked.
     Epics are NOT board columns; tickets are first-class cards initially placed in Backlog.
  4. Operational Dependencies: Prerequisite checklists and explicit manual Definition of Ready
     gates because YouGile does not have automated transition blocking rules.
  5. Strict Destination Safety: Live mode REQUIRES either an explicit destination mapping file
     or an explicit --create-new-project flag. It NEVER silently creates a project.
  6. Cache Isolation: Dry-run and live modes use separate cache files by default. Live mode
     actively purges and rejects any simulated ("dryrun-*") IDs to prevent contamination.
  7. Idempotent & Resumable: Employs schema-backed idempotencyKey and persistent ID mapping cache.
"""

import argparse
import collections
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional, Set, Tuple

DEFAULT_MANIFEST_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "backlog_manifest.json"
)
DEFAULT_DRYRUN_MAP_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "yougile_id_map.dryrun.json"
)
DEFAULT_LIVE_MAP_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "yougile_id_map.live.json"
)
DEFAULT_REPORT_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "population_verification_report.json"
)

YOUGILE_API_BASE = "https://yougile.com/api-v2"
RATE_LIMIT_DELAY_SECONDS = 1.5  # 40 requests per minute (Limit: 50/min)

WORKFLOW_COLUMNS = [
    {"name": "Backlog", "color": 1, "description": "Initial backlog of approved tickets topologically sequenced"},
    {"name": "Ready", "color": 2, "description": "Tickets whose prerequisites are 100% completed and ready for development"},
    {"name": "In Progress", "color": 5, "description": "Tickets actively being implemented"},
    {"name": "Review", "color": 7, "description": "Pull requests under review / validation testing"},
    {"name": "Done", "color": 6, "description": "Acceptance criteria and validation requirements satisfied"},
    {"name": "Blocked", "color": 3, "description": "Tickets blocked by technical or external impediments"}
]

EPIC_COLORS = {
    "Epic-1": "task-primary",
    "Epic-2": "task-blue",
    "Epic-3": "task-turquoise",
    "Epic-4": "task-green",
    "Epic-5": "task-yellow",
    "Epic-6": "task-violet",
    "Epic-7": "task-pink",
    "Epic-8": "task-gray",
    "Epic-9": "task-red",
    "Epic-10": "task-primary"
}


def is_simulated_id(val: Any) -> bool:
    """Checks whether an entity ID is a simulated dry-run ID."""
    if not isinstance(val, str):
        return False
    v = val.strip().lower()
    return v.startswith("dryrun-") or "_simulated" in v


def sanitize_cache_for_live_mode(id_map: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
    """
    Sanitizes an ID mapping dictionary for live execution.
    Purges any simulated IDs from project, board, columns, and tickets.
    Returns the sanitized map and the count of purged simulated IDs.
    """
    purged_count = 0
    sanitized: Dict[str, Any] = {
        "_metadata": {"mode": "live", "lastSanitized": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())},
        "project": {},
        "board": {},
        "columns": {},
        "tickets": {},
    }

    # If the loaded map was explicitly tagged as a dry-run file, reject all its entity mappings
    if id_map.get("_metadata", {}).get("mode") == "dry-run":
        if id_map.get("project", {}).get("id"):
            purged_count += 1
        if id_map.get("board", {}).get("id"):
            purged_count += 1
        for col_name, col_id in id_map.get("columns", {}).items():
            if col_id:
                purged_count += 1
        for t_id, ticket_uuid in id_map.get("tickets", {}).items():
            if ticket_uuid:
                purged_count += 1
        return sanitized, purged_count

    # Check project
    proj_id = id_map.get("project", {}).get("id")
    if proj_id:
        if is_simulated_id(proj_id):
            purged_count += 1
        else:
            sanitized["project"]["id"] = proj_id
            if "title" in id_map["project"]:
                sanitized["project"]["title"] = id_map["project"]["title"]

    # Check board
    board_id = id_map.get("board", {}).get("id")
    if board_id:
        if is_simulated_id(board_id):
            purged_count += 1
        else:
            sanitized["board"]["id"] = board_id
            if "title" in id_map["board"]:
                sanitized["board"]["title"] = id_map["board"]["title"]

    # Check columns
    for col_name, col_id in id_map.get("columns", {}).items():
        if col_id:
            if is_simulated_id(col_id):
                purged_count += 1
            else:
                sanitized["columns"][col_name] = col_id

    # Check tickets
    for t_id, ticket_uuid in id_map.get("tickets", {}).items():
        if ticket_uuid:
            if is_simulated_id(ticket_uuid):
                purged_count += 1
            else:
                sanitized["tickets"][t_id] = ticket_uuid

    return sanitized, purged_count


class YouGileClient:
    """HTTP client for YouGile REST API v2 with rate-limiting and retry logic."""

    def __init__(self, api_key: Optional[str] = None, dry_run: bool = True):
        self.api_key = api_key
        self.dry_run = dry_run
        self.last_request_time = 0.0

    def _rate_limit(self):
        elapsed = time.time() - self.last_request_time
        if elapsed < RATE_LIMIT_DELAY_SECONDS:
            time.sleep(RATE_LIMIT_DELAY_SECONDS - elapsed)
        self.last_request_time = time.time()

    def request(
        self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if self.dry_run:
            seed = f"{method}:{endpoint}:{json.dumps(data, sort_keys=True) if data else ''}"
            fake_uuid = hashlib.sha256(seed.encode("utf-8")).hexdigest()[:32]
            formatted_uuid = (
                f"dryrun-{fake_uuid[:8]}-{fake_uuid[8:12]}-{fake_uuid[12:16]}-{fake_uuid[16:20]}-{fake_uuid[20:32]}"
            )
            return {"id": formatted_uuid, "_simulated": True}

        if not self.api_key:
            raise ValueError(
                "YouGile API key is required for live mode. Set YOUGILE_API_KEY environment variable."
            )

        self._rate_limit()

        url = f"{YOUGILE_API_BASE}{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        body_bytes = json.dumps(data).encode("utf-8") if data else None
        req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)

        max_retries = 5
        backoff = 2.0

        for attempt in range(max_retries):
            try:
                with urllib.request.urlopen(req) as resp:
                    resp_data = resp.read().decode("utf-8")
                    return json.loads(resp_data) if resp_data else {}
            except urllib.error.HTTPError as e:
                resp_body = e.read().decode("utf-8") if e.fp else ""
                if e.code == 429:
                    print(
                        f"[RATE LIMIT] HTTP 429 received. Backing off for 60s (Attempt {attempt + 1}/{max_retries})..."
                    )
                    time.sleep(60.0)
                    continue
                elif e.code >= 500 and attempt < max_retries - 1:
                    print(
                        f"[SERVER ERROR] HTTP {e.code} received. Retrying in {backoff}s..."
                    )
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                else:
                    raise RuntimeError(
                        f"YouGile API error {e.code} {e.reason} on {method} {endpoint}: {resp_body}"
                    )
            except urllib.error.URLError as e:
                if attempt < max_retries - 1:
                    print(
                        f"[NETWORK ERROR] {e.reason}. Retrying in {backoff}s..."
                    )
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                else:
                    raise RuntimeError(
                        f"Network error on {method} {endpoint}: {e.reason}"
                    )

        raise RuntimeError(f"Failed {method} {endpoint} after {max_retries} attempts.")


def build_ticket_description(ticket: Dict[str, Any]) -> str:
    """Builds a comprehensive, rich Markdown description for a YouGile ticket."""
    h = ticket["hierarchy"]
    prereqs = ticket.get("dependencies", [])
    prereqs_str = ", ".join(prereqs) if prereqs else "None (Root Ticket - Ready for initial sprint pull)"

    lines = [
        f"# [{ticket['hierarchy']['epicId']} | {ticket['id']}]: {ticket['title']}",
        "",
        "## Hierarchy Traceability (6-Level Logical Hierarchy)",
        f"- **MVP (Level 1):** BookFlow MVP",
        f"- **Epic (Level 2):** {h.get('epicTitle', 'N/A')}",
        f"- **Feature (Level 3):** {h.get('featureTitle', 'N/A')}",
        f"- **Stage (Level 4):** {h.get('stageTitle', 'N/A')}",
        f"- **Sub-stage (Level 5):** {h.get('substageTitle', 'N/A')}",
        f"- **Ticket (Level 6):** [{ticket['id']}] {ticket['title']}",
        "",
        "## Objective",
        ticket["objective"],
        "",
        "## Scope",
        ticket["scope"],
        "",
        "## Implementation Tasks",
        f"### Frontend Work\n{ticket['frontendWork']}\n",
        f"### Backend Work\n{ticket['backendWork']}\n",
        f"### API & Data Requirements\n{ticket['apiDataRequirements']}\n",
        "## Acceptance Criteria",
        ticket["acceptanceCriteria"],
        "",
        "## Dependencies & Operational Prerequisites",
        f"- **Required Prerequisites:** {prereqs_str}",
        "- **Operational Rule (Definition of Ready):** This ticket CANNOT be transitioned from 'Backlog' to 'Ready' or 'In Progress' until all prerequisite tickets are in the 'Done' column. (Note: YouGile does not have automated transition blocking; this is an enforced operational rule).",
        "",
        "## UI & Visual Reference",
        ticket["uiReference"],
        "",
        "## Verification & Testing Requirements",
        ticket["validationRequirements"],
    ]
    return "\n".join(lines)


def build_ticket_checklists(ticket: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extracts prerequisite gates, acceptance criteria, and validation gates into native YouGile checklist format."""
    checklists = []

    # 1. Prerequisite Gates Checklist
    prereqs = ticket.get("dependencies", [])
    prereq_items = []
    if prereqs:
        for p in prereqs:
            prereq_items.append({
                "title": f"Prerequisite {p} verified in DONE column",
                "isCompleted": False
            })
    else:
        prereq_items.append({
            "title": "Root Ticket: No prerequisite blockers (Ready for pull)",
            "isCompleted": True
        })
    checklists.append({"title": "Prerequisite Gates (Definition of Ready)", "items": prereq_items})

    # 2. Acceptance Criteria Checklist
    ac_raw = ticket["acceptanceCriteria"]
    ac_items = []
    for line in ac_raw.split("\n"):
        clean = line.strip().lstrip("-* ").strip()
        if clean:
            ac_items.append({"title": clean[:250], "isCompleted": False})
    if ac_items:
        checklists.append({"title": "Acceptance Criteria", "items": ac_items})

    # 3. Validation Requirements Checklist
    val_raw = ticket["validationRequirements"]
    val_items = []
    for line in val_raw.split("\n"):
        clean = line.strip().lstrip("-* ").strip()
        if clean:
            val_items.append({"title": clean[:250], "isCompleted": False})
    if val_items:
        checklists.append({"title": "Validation Gates", "items": val_items})

    return checklists


def validate_backlog_graph(
    manifest: Dict[str, Any]
) -> Tuple[bool, List[str], List[str]]:
    """Performs rigorous offline validation of the backlog DAG and required fields."""
    errors = []

    tickets = manifest.get("tickets", [])
    ticket_ids = set()
    ticket_map = {}

    for t in tickets:
        t_id = t["id"]
        if t_id in ticket_ids:
            errors.append(f"Duplicate ticket ID detected: {t_id}")
        ticket_ids.add(t_id)
        ticket_map[t_id] = t

    expected_ticket_count = 56
    if len(ticket_ids) != expected_ticket_count:
        errors.append(
            f"Expected {expected_ticket_count} tickets, found {len(ticket_ids)}"
        )

    # Required fields check
    req_fields = [
        "id",
        "title",
        "objective",
        "scope",
        "frontendWork",
        "backendWork",
        "apiDataRequirements",
        "acceptanceCriteria",
        "dependencies",
        "uiReference",
        "validationRequirements",
        "hierarchy",
    ]
    for t_id, t in ticket_map.items():
        for f in req_fields:
            if f not in t or t[f] is None:
                errors.append(f"Ticket {t_id} missing mandatory field: {f}")
            elif f != "dependencies" and isinstance(t[f], (str, list, dict)) and len(t[f]) == 0:
                errors.append(f"Ticket {t_id} has empty mandatory field: {f}")

    # Dependency resolution and DAG check
    adj = collections.defaultdict(list)
    in_degree = {t_id: 0 for t_id in ticket_ids}

    for t_id, t in ticket_map.items():
        for d in t["dependencies"]:
            if d.startswith("D-") or d.startswith("K-"):
                continue
            if d not in ticket_ids:
                errors.append(f"Ticket {t_id} references unknown dependency: {d}")
            else:
                adj[d].append(t_id)
                in_degree[t_id] += 1

    # Topological sort (Kahn's algorithm)
    queue = collections.deque([t_id for t_id, deg in in_degree.items() if deg == 0])
    topo_order = []
    while queue:
        curr = queue.popleft()
        topo_order.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                queue.append(nxt)

    if len(topo_order) != len(ticket_ids):
        errors.append(
            f"Dependency graph contains cycles! Only {len(topo_order)} of {len(ticket_ids)} tickets resolved."
        )

    return (len(errors) == 0), errors, topo_order


def run_population(
    manifest_path: str,
    map_path: str,
    report_path: str,
    dry_run: bool = True,
    create_new_project: bool = False,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Executes or dry-runs the complete YouGile population workflow."""
    print("=" * 80)
    print(
        f"BOOKFLOW YOUGILE POPULATION ENGINE — {'DRY-RUN (OFFLINE)' if dry_run else 'LIVE EXECUTION'}"
    )
    print("=" * 80)

    # 1. Load manifest
    if not os.path.exists(manifest_path):
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # 2. Offline Validation
    valid, errors, topo_order = validate_backlog_graph(manifest)
    if not valid:
        print("[VALIDATION FAILED]")
        for err in errors:
            print(f"  - {err}")
        raise ValueError("Backlog DAG validation failed.")
    print("[VALIDATION PASSED] All 56 tickets, fields, and DAG verified cleanly.")

    # 3. Load and sanitize ID mappings
    id_map = {
        "_metadata": {"mode": "dry-run" if dry_run else "live"},
        "project": {},
        "board": {},
        "columns": {},
        "tickets": {},
    }
    if os.path.exists(map_path):
        try:
            with open(map_path, "r", encoding="utf-8") as f:
                loaded_map = json.load(f)
                if isinstance(loaded_map, dict):
                    id_map.update(loaded_map)
                print(f"[CACHE] Loaded existing mappings from {map_path}")
        except Exception as e:
            print(f"[CACHE WARNING] Could not parse mapping file {map_path}: {e}")

    # Enforce Cache Isolation: Sanitize for live mode
    if not dry_run:
        id_map, purged_simulated_count = sanitize_cache_for_live_mode(id_map)
        if purged_simulated_count > 0:
            print(
                f"[CACHE ISOLATION] Purged {purged_simulated_count} simulated dry-run IDs from cache.\n"
                f"Simulated IDs are strictly prohibited in live execution."
            )

    # Destination Safety Check in Live Mode
    if not dry_run:
        proj_id = id_map.get("project", {}).get("id")
        board_id = id_map.get("board", {}).get("id")
        backlog_id = id_map.get("columns", {}).get("Backlog")

        has_existing_destination = (
            bool(proj_id) and not is_simulated_id(proj_id) and
            bool(board_id) and not is_simulated_id(board_id) and
            bool(backlog_id) and not is_simulated_id(backlog_id)
        )

        if not has_existing_destination and not create_new_project:
            print(
                "\n[SAFETY STOP] Destination is unspecified and --create-new-project was not passed.\n"
                "In live mode, to prevent unintended or duplicate modifications to your YouGile workspace,\n"
                "you MUST either:\n"
                "  1. Provide an explicit mapping file containing valid target UUIDs:\n"
                "     --map-file <path_to_mapping.json>\n"
                "  OR\n"
                "  2. Explicitly authorize creating a new project in your workspace:\n"
                "     --create-new-project\n\n"
                "Live execution aborted safely with 0 changes made."
            )
            sys.exit(1)

    client = YouGileClient(api_key=api_key, dry_run=dry_run)

    mvp_info = manifest["mvp"]
    tickets_dict = {t["id"]: t for t in manifest["tickets"]}

    stats = {
        "mode": "dry-run" if dry_run else "live",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "counts": {
            "mvp": 1,
            "epics": len(manifest.get("hierarchy", [])),
            "tickets": len(tickets_dict),
            "topoOrderLength": len(topo_order),
            "workflowColumns": len(WORKFLOW_COLUMNS),
        },
        "created": {
            "projects": 0,
            "boards": 0,
            "columns": 0,
            "tickets": 0,
        },
        "resolvedFromCache": 0,
        "payloads": [],
    }

    def save_map():
        id_map["_metadata"] = {
            "mode": "dry-run" if dry_run else "live",
            "lastSaved": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        }
        with open(map_path, "w", encoding="utf-8") as f_out:
            json.dump(id_map, f_out, indent=2, ensure_ascii=False)

    # 4. Resolve or create Project
    project_id = id_map["project"].get("id")
    if not project_id:
        proj_payload = {
            "title": mvp_info["targetProject"],
            "idempotencyKey": f"bookflow-project-{mvp_info['title'].lower()}",
        }
        res = client.request("POST", "/projects", proj_payload)
        project_id = res["id"]
        id_map["project"]["id"] = project_id
        id_map["project"]["title"] = mvp_info["targetProject"]
        stats["created"]["projects"] += 1
        save_map()
        print(f"[PROJECT] Created/Mapped Project '{mvp_info['targetProject']}' -> {project_id}")
    else:
        stats["resolvedFromCache"] += 1
        print(f"[PROJECT] Using targeted/cached Project ID: {project_id}")

    # 5. Resolve or create Board
    board_id = id_map["board"].get("id")
    if not board_id:
        board_payload = {
            "title": mvp_info["targetBoard"],
            "projectId": project_id,
            "idempotencyKey": "bookflow-board-mvp-implementation",
        }
        res = client.request("POST", "/boards", board_payload)
        board_id = res["id"]
        id_map["board"]["id"] = board_id
        id_map["board"]["title"] = mvp_info["targetBoard"]
        stats["created"]["boards"] += 1
        save_map()
        print(f"[BOARD] Created/Mapped Board '{mvp_info['targetBoard']}' -> {board_id}")
    else:
        stats["resolvedFromCache"] += 1
        print(f"[BOARD] Using targeted/cached Board ID: {board_id}")

    # 6. Resolve or create 6 Workflow Columns
    if "columns" not in id_map:
        id_map["columns"] = {}

    print("\n[WORKFLOW COLUMNS] Setting up 6 workflow columns...")
    for col_info in WORKFLOW_COLUMNS:
        col_name = col_info["name"]
        col_id = id_map["columns"].get(col_name)
        if not col_id:
            col_payload = {
                "title": col_name,
                "boardId": board_id,
                "color": col_info["color"],
                "idempotencyKey": f"bookflow-workflow-column-{col_name.lower().replace(' ', '-')}",
            }
            res = client.request("POST", "/columns", col_payload)
            col_id = res["id"]
            id_map["columns"][col_name] = col_id
            stats["created"]["columns"] += 1
            save_map()
            print(f"  [COLUMN] Created Workflow Column '{col_name}' -> {col_id}")
        else:
            stats["resolvedFromCache"] += 1
            print(f"  [COLUMN] Using targeted/cached Column '{col_name}' -> {col_id}")

    backlog_col_id = id_map["columns"].get("Backlog")
    if not backlog_col_id:
        raise RuntimeError("Failed to resolve 'Backlog' column ID for ticket placement.")

    # 7. Create Tickets in Topological Dependency Order (All placed in Backlog initially)
    print(f"\n[POPULATING TICKETS] Placing 56 tickets into Backlog column in topological order...")
    if "tickets" not in id_map:
        id_map["tickets"] = {}

    for t_id in topo_order:
        ticket = tickets_dict[t_id]
        epic_id = ticket["hierarchy"]["epicId"]
        card_color = EPIC_COLORS.get(epic_id, "task-primary")

        existing_ticket_id = id_map["tickets"].get(t_id)
        if existing_ticket_id:
            stats["resolvedFromCache"] += 1
            continue

        desc = build_ticket_description(ticket)
        checklists = build_ticket_checklists(ticket)
        title_with_epic = f"[{epic_id} | {ticket['id']}] {ticket['title']}"

        task_payload = {
            "title": title_with_epic,
            "columnId": backlog_col_id,
            "description": desc,
            "color": card_color,
            "idTaskProject": ticket["id"],
            "idTaskCommon": ticket["id"],
            "checklists": checklists,
            "idempotencyKey": f"bookflow-ticket-{ticket['id'].lower()}",
        }

        if len(stats["payloads"]) < 5 or t_id in ["T-01", "T-10", "T-13", "T-28", "T-56"]:
            stats["payloads"].append(
                {
                    "ticketId": t_id,
                    "title": task_payload["title"],
                    "columnId": task_payload["columnId"],
                    "cardColor": task_payload["color"],
                    "checklistsCount": len(checklists),
                    "idempotencyKey": task_payload["idempotencyKey"],
                    "descLength": len(desc),
                }
            )

        res = client.request("POST", "/tasks", task_payload)
        ticket_yougile_id = res["id"]
        id_map["tickets"][t_id] = ticket_yougile_id
        stats["created"]["tickets"] += 1
        save_map()
        print(f"  [TICKET] Populated {ticket['id']}: {ticket['title'][:45]}... -> {ticket_yougile_id}")

    # 8. Save final report
    with open(report_path, "w", encoding="utf-8") as f_out:
        json.dump(stats, f_out, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print("POPULATION RUN COMPLETE")
    print("=" * 80)
    print(f"Mode: {'DRY-RUN (Simulated)' if dry_run else 'LIVE'}")
    print(f"Workflow Columns: Backlog, Ready, In Progress, Review, Done, Blocked")
    print(f"Tickets Populated into Backlog: {stats['created']['tickets']}")
    print(f"Entities Resolved from Cache: {stats['resolvedFromCache']}")
    print(f"Verification Report: {report_path}")
    print(f"ID Mapping Cache: {map_path}")
    print("=" * 80)

    return stats


def main():
    parser = argparse.ArgumentParser(
        description="BookFlow YouGile Population Tool (Phase 7.2.2)"
    )
    parser.add_argument(
        "--mode",
        choices=["dry-run", "live"],
        default="dry-run",
        help="Execution mode (default: dry-run, offline with no network calls)",
    )
    parser.add_argument(
        "--create-new-project",
        action="store_true",
        help="Explicitly authorize creating a new project, board, and workflow columns when destination is not specified in live mode",
    )
    parser.add_argument(
        "--manifest",
        default=DEFAULT_MANIFEST_PATH,
        help="Path to backlog manifest JSON",
    )
    parser.add_argument(
        "--map-file",
        default=None,
        help="Path to YouGile ID mapping JSON file (defaults to yougile_id_map.dryrun.json for dry-run and yougile_id_map.live.json for live)",
    )
    parser.add_argument(
        "--report-file",
        default=DEFAULT_REPORT_PATH,
        help="Path to output verification report JSON",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("YOUGILE_API_KEY"),
        help="YouGile Bearer API key (only required for --mode live)",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Only run offline DAG and schema validation, do not simulate population",
    )

    args = parser.parse_args()

    if args.verify_only:
        with open(args.manifest, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        valid, errors, topo_order = validate_backlog_graph(manifest)
        if valid:
            print("[VERIFICATION SUCCESS] Backlog DAG is valid with 56 tickets and 0 cycles.")
            sys.exit(0)
        else:
            print("[VERIFICATION FAILED]")
            for err in errors:
                print(f"  - {err}")
            sys.exit(1)

    is_dry_run = args.mode == "dry-run"

    # Select appropriate default cache file if not explicitly provided
    effective_map_file = args.map_file
    if effective_map_file is None:
        effective_map_file = DEFAULT_DRYRUN_MAP_PATH if is_dry_run else DEFAULT_LIVE_MAP_PATH

    if not is_dry_run and not args.api_key:
        print(
            "ERROR: Live mode requested but YOUGILE_API_KEY environment variable or --api-key flag is not set.\n"
            "Live population cannot proceed without authorization and API credentials.\n"
            "To test safely offline, use default --mode dry-run."
        )
        sys.exit(1)

    run_population(
        manifest_path=args.manifest,
        map_path=effective_map_file,
        report_path=args.report_file,
        dry_run=is_dry_run,
        create_new_project=args.create_new_project,
        api_key=args.api_key,
    )


if __name__ == "__main__":
    main()
