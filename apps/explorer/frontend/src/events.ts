import type { EventKindDef } from "./lib/types";

/**
 * Define your event kinds here. Each kind gets a label and a glyph rendered
 * in the activity feed.
 *
 * The `id` must match the `kind` string returned by your source canister.
 * Glyphs are single Unicode characters (or short strings) — they appear as
 * the kind indicator in ledger-style activity rows.
 */
export const EVENT_KINDS: EventKindDef[] = [
  { id: "create",   label: "Create",   glyph: "⊕" },
  { id: "update",   label: "Update",   glyph: "↻" },
  { id: "delete",   label: "Delete",   glyph: "⊖" },
  { id: "transfer", label: "Transfer", glyph: "↗" },
];

export function getEventKind(id: string): EventKindDef | undefined {
  return EVENT_KINDS.find((k) => k.id === id);
}
