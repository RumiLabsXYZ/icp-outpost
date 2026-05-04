import type { AppConfig } from "../../apps/explorer/frontend/src/lib/types";

/**
 * Rumi Protocol explorer configuration.
 *
 * Watches the Rumi CDP stablecoin protocol on the Internet Computer.
 * Source: rumi_analytics for time-series and summary data.
 * Source: rumi_protocol_backend for event history.
 */
export const APP_CONFIG: AppConfig = {
  name: "Rumi Explorer",
  tagline: "protocol observer",
  github: "https://github.com/RumiLabsXYZ/rumi-protocol-v2",

  sources: {
    // rumi_analytics — aggregated TVL, peg, fee series
    main: "dtlu2-uqaaa-aaaap-qugcq-cai",
    // rumi_protocol_backend — event history, vault state
    secondary: "tfesu-vyaaa-aaaap-qrd7a-cai",
  },

  theme: {
    accent: { light: "158 30% 36%", dark: "158 35% 50%" },
  },

  nav: [
    { to: "/activity", label: "Activity" },
    { to: "/lens/collateral", label: "Collateral" },
    { to: "/lens/stability-pool", label: "Stability Pool" },
    { to: "/lens/revenue", label: "Revenue" },
    { to: "/lens/redemptions", label: "Redemptions" },
    { to: "/lens/dex", label: "DEX" },
    { to: "/lens/admin", label: "Admin" },
    { to: "/health", label: "Health" },
  ],
};
