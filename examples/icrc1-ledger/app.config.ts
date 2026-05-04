import type { AppConfig } from "../../apps/explorer/frontend/src/lib/types";

/**
 * ICRC-1 Ledger Explorer configuration.
 *
 * By default points at the ICP ledger. Change `main` to any ICRC-1/ICRC-3
 * compatible token canister (ckBTC, ckETH, your own token, etc.).
 *
 * The BFF's AppEvents.mo must be updated to match the token's ICRC-3 block shape
 * if it differs from the standard Transfer/Mint/Burn/Approve shape.
 */
export const APP_CONFIG: AppConfig = {
  name: "ICRC-1 Ledger Explorer",
  tagline: "token activity",
  github: "https://github.com/RumiLabsXYZ/icp-outpost",

  sources: {
    // ICP ledger (mainnet). Replace with your token canister.
    main: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  },

  theme: {
    accent: { light: "220 60% 45%", dark: "220 60% 60%" },
  },

  nav: [
    { to: "/activity", label: "Transfers" },
    { to: "/health", label: "Health" },
  ],
};
