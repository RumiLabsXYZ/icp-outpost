import type { EntityDef } from "../../apps/explorer/frontend/src/lib/types";

/**
 * Rumi Protocol entity definitions.
 *
 * Vault: /e/vault/:id — shows collateral, debt, history
 * Pool: /e/pool/:id — shows reserves, LP supply, virtual price
 * Token: /e/token/:ledger — shows supply, fee, recent transfers
 */
export const ENTITIES: EntityDef[] = [
  {
    type: "vault",
    label: "Vault",
    // Custom fetch would call bff.get_vault(id) — available in the full Rumi explorer
  },
  {
    type: "pool",
    label: "Pool",
  },
  {
    type: "token",
    label: "Token",
  },
];
