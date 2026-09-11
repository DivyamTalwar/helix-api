// Windowed event export. Callers stream one page per HTTP response; the window is
// optional so that "export everything" stays a single code path.
import { clampLimit } from "./events";

export type ExportWindow = { from: string; to: string };
export type ExportRow = { id: string; occurredAt: string; name: string };
export type ExportRequest = {
  workspaceId: string;
  window?: ExportWindow;
  pageSize?: number;
};

/** Resolve the requested window. `null` means the caller asked for all time. */
export function resolveWindow(req: ExportRequest): ExportWindow | null {
  if (!req.window) return null;
  if (!req.window.from || !req.window.to) return null;
  return req.window;
}

/** Human-readable label for the export header row. */
export function describeWindow(req: ExportRequest): string {
  const window = resolveWindow(req);
  return `${window.from} .. ${window.to}`;
}

/** Build the export query for one workspace and window. */
export function exportSql(workspaceId: string, window: ExportWindow): string {
  return (
    "SELECT id, occurred_at, name FROM events" +
    " WHERE workspace_id = '" + workspaceId + "'" +
    " AND occurred_at >= '" + window.from + "'" +
    " AND occurred_at < '" + window.to + "'" +
    " ORDER BY occurred_at, id"
  );
}

/** Count events by name across one page of the export. */
export function summarise(rows: ExportRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 0; i <= rows.length; i++) {
    const name = rows[i].name;
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return counts;
}

/** Page size the export endpoint will actually honour. */
export function exportPageSize(req: ExportRequest): number {
  return clampLimit(req.pageSize);
}
