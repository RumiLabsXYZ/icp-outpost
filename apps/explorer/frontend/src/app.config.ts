import type { AppConfig } from "./lib/types";

/**
 * Edit this file to brand your explorer and point at your canisters.
 *
 * After editing, run `npm run build && icp deploy -e ic` to ship.
 */
export const APP_CONFIG: AppConfig = {
  name: "My App Explorer",
  tagline: "Read-only window",
  github: "https://github.com/yourorg/yourapp",

  /**
   * Canister IDs. Add as many as you need.
   * Local development: leave these blank — `icp deploy` will populate canister
   * IDs in the ic_env cookie automatically. For production deployments, fill
   * with your real mainnet canister IDs and pass them as init args to the BFF.
   */
  sources: {
    main: "rrkah-fqaaa-aaaaa-aaaaq-cai", // EDIT — your primary source canister
  },

  /**
   * Brand color. HSL string (no `hsl()` wrapper). Default: verdigris.
   */
  theme: {
    accent: { light: "158 30% 36%", dark: "158 35% 50%" },
  },

  /**
   * Top nav structure. Routes that don't match any nav entry still work — this
   * is purely the visible navigation.
   */
  nav: [
    { to: "/activity", label: "Activity" },
    { to: "/health", label: "Health" },
  ],
};
