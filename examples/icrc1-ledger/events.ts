import type { EventKindDef } from "../../apps/explorer/frontend/src/lib/types";

/**
 * ICRC-3 block kinds for a standard ICRC-1 ledger.
 * These match the `kind` field in ICRC-3 GetBlocksResponse block records.
 */
export const EVENT_KINDS: EventKindDef[] = [
  { id: "transfer",  label: "Transfer",  glyph: "↗" },
  { id: "mint",      label: "Mint",      glyph: "⊕" },
  { id: "burn",      label: "Burn",      glyph: "⊖" },
  { id: "approve",   label: "Approve",   glyph: "✓" },
];

export function getEventKind(id: string): EventKindDef | undefined {
  return EVENT_KINDS.find((k) => k.id === id);
}
