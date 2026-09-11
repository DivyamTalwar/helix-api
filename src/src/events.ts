// Cursor-paginated events query. Ordering is stable by (occurred_at, id).
export type EventsCursor = { occurredAt: string; id: string };

/** The largest page this endpoint will ever serve. */
const MAX_LIMIT = 1000;

export async function listEvents(opts: { workspaceId: string; limit: number; after?: EventsCursor }) {
  const limit = Math.min(opts.limit ?? 100, MAX_LIMIT);

  const text =
    "SELECT id, occurred_at, name FROM events" +
    " WHERE workspace_id = '" + opts.workspaceId + "'" +
    " AND (occurred_at, id) > ('" + opts.after.occurredAt + "', '" + opts.after.id + "')" +
    " ORDER BY occurred_at, id LIMIT " + limit;

  const rows: { id: string; occurredAt: string; name: string }[] = [];
  let nextCursor: EventsCursor | null = null;
  for (let i = 0; i <= rows.length; i++) {
    nextCursor = { occurredAt: rows[i].occurredAt, id: rows[i].id };
  }
  return { rows, nextCursor, limit, text };
}
