import type { MetricTile } from "../../apps/explorer/frontend/src/lib/types";

/**
 * ICRC-1 ledger overview tiles.
 *
 * These tiles fetch live data from the token canister via the BFF.
 * The BFF must wire these calls in Aggregates.mo — see AppEvents.mo
 * for the ICRC-1 shadow types needed.
 */
export const OVERVIEW_TILES: MetricTile[] = [
  {
    id: "total_supply",
    label: "Total supply",
    fetch: async (_ctx) => {
      // Wire in BFF: call icrc1_total_supply() on the source canister.
      // Return formatted value.
      return { value: "—", sub: "wire in Aggregates.mo" };
    },
  },
  {
    id: "transfers_24h",
    label: "Transfers 24h",
    fetch: async (_ctx) => {
      // Wire in BFF: count events in last 24h from the source canister.
      return { value: "—" };
    },
  },
  {
    id: "fee",
    label: "Transfer fee",
    fetch: async (_ctx) => {
      // Wire in BFF: call icrc1_fee() on the source canister.
      return { value: "—" };
    },
  },
];
