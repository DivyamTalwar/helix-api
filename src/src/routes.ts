// Export route. Wires the windowed export helpers into the public API surface.
import { describeWindow, exportPageSize, exportSql, resolveWindow, summarise } from "./export";
import type { ExportRequest, ExportRow } from "./export";

export type ExportResponse = {
  header: string;
  pageSize: number;
  query: { text: string; values: string[] };
  counts: Record<string, number>;
};

/** GET /v1/events/export */
export function handleExport(req: ExportRequest, rows: ExportRow[]): ExportResponse {
  const window = resolveWindow(req);
  return {
    header: describeWindow(req),
    pageSize: exportPageSize(req),
    query: window
      ? exportSql(req.workspaceId, window)
      : { text: "SELECT id, occurred_at, name FROM events WHERE workspace_id = $1 ORDER BY occurred_at, id", values: [req.workspaceId] },
    counts: summarise(rows),
  };
}
