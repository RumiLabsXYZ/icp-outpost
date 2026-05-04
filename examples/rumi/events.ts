import type { EventKindDef } from "../../apps/explorer/frontend/src/lib/types";

/**
 * Rumi Protocol event kinds.
 * These match the `kind` field returned by rumi_protocol_backend.get_events_filtered.
 */
export const EVENT_KINDS: EventKindDef[] = [
  { id: "open_vault",               label: "Vault opened",         glyph: "⊕" },
  { id: "close_vault",              label: "Vault closed",         glyph: "⊖" },
  { id: "adjust_vault",             label: "Vault adjusted",       glyph: "↻" },
  { id: "borrow",                   label: "Borrow",               glyph: "↗" },
  { id: "repay",                    label: "Repay",                glyph: "↙" },
  { id: "liquidation",              label: "Liquidation",          glyph: "✕" },
  { id: "partial_liquidation",      label: "Partial liquidation",  glyph: "⚠" },
  { id: "redemption",               label: "Redemption",           glyph: "↺" },
  { id: "reserve_redemption",       label: "Reserve redemption",   glyph: "↺" },
  { id: "stability_pool_deposit",   label: "SP deposit",           glyph: "▼" },
  { id: "stability_pool_withdraw",  label: "SP withdraw",          glyph: "▲" },
  { id: "admin_mint",               label: "Admin mint",           glyph: "+" },
  { id: "admin_sweep_to_treasury",  label: "Treasury sweep",       glyph: "→" },
  { id: "price_update",             label: "Price update",         glyph: "·" },
  { id: "accrue_interest",          label: "Interest accrual",     glyph: "%" },
];

export function getEventKind(id: string): EventKindDef | undefined {
  return EVENT_KINDS.find((k) => k.id === id);
}
