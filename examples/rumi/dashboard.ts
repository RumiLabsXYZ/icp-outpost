import type { MetricTile } from "../../apps/explorer/frontend/src/lib/types";

/**
 * Rumi Protocol overview tiles.
 * TVL, peg, open vaults, and icUSD supply — the four headline numbers.
 */
export const OVERVIEW_TILES: MetricTile[] = [
  {
    id: "tvl",
    label: "TVL",
    fetch: async ({ bff }) => {
      const overview = await bff.get_overview();
      const tvl = (overview as unknown as { tvl_usd?: number }).tvl_usd ?? 0;
      return {
        value: `$${tvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        sub: "total collateral",
      };
    },
  },
  {
    id: "icusd_supply",
    label: "icUSD Supply",
    fetch: async ({ bff }) => {
      const overview = await bff.get_overview();
      const supply = (overview as unknown as { icusd_supply?: { formatted: string } }).icusd_supply;
      return { value: supply?.formatted ?? "—", sub: "circulating" };
    },
  },
  {
    id: "peg",
    label: "Peg",
    fetch: async ({ bff }) => {
      const overview = await bff.get_overview();
      const peg = (overview as unknown as { icusd_peg_usd?: number }).icusd_peg_usd ?? 1;
      const dir = peg > 1.0001 ? "above peg" : peg < 0.9999 ? "below peg" : "at peg";
      return { value: `$${peg.toFixed(4)}`, sub: dir };
    },
  },
  {
    id: "vaults",
    label: "Open Vaults",
    fetch: async ({ bff }) => {
      const overview = await bff.get_overview();
      const count = (overview as unknown as { vault_count_open?: bigint }).vault_count_open ?? 0n;
      return { value: String(count) };
    },
  },
];
