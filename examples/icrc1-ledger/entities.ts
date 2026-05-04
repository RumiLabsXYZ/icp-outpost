import type { EntityDef } from "../../apps/explorer/frontend/src/lib/types";

/**
 * ICRC-1 ledger entity definitions.
 *
 * Account: /e/account/:principal — shows recent transfers for this account.
 */
export const ENTITIES: EntityDef[] = [
  {
    type: "account",
    label: "Account",
    // When a principal is searched, route to /e/account/:principal.
    // The BFF can filter get_events_filtered by principal to show
    // this account's recent transfers.
  },
];
