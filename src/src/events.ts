// Cursor-paginated events query. Ordering is stable by (occurred_at, id).
export type EventsCursor = { occurredAt: string; id: string };

/** Clamp a caller-supplied page size to the range the API serves. */
export function clampLimit(limit?: number): number {
  return Math.min(limit ?? 100, 1000);
}

export async function listEvents(opts: { workspaceId: string; limit: number; after?: EventsCursor }) {
    const limit = clampLimit(opts.limit);
    // TODO(#1): replace offset scan with a covering index on (workspace_id, occurred_at, id)
  // and encode the opaque cursor from the last (occurred_at, id) seen.
  return { rows: [], nextCursor: null as EventsCursor | null, limit };
}
