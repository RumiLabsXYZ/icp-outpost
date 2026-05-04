/**
 * Core type definitions for the Outpost framework.
 * These are used by app.config.ts, events.ts, dashboard.ts, and entities.ts.
 */

export interface NavItem {
  to: string;
  label: string;
}

export interface AppConfig {
  /** Display name of your app. Shown in the nav and page title. */
  name: string;
  /** Short tagline shown under the nav logo. */
  tagline?: string;
  /** GitHub URL (or any link) shown in the footer. */
  github?: string;
  /** Source canister IDs. */
  sources: {
    main: string;
    [key: string]: string;
  };
  /** Brand color override. HSL string, no hsl() wrapper. */
  theme?: {
    accent?: {
      light?: string;
      dark?: string;
    };
  };
  /** Top nav entries. */
  nav: NavItem[];
}

export interface EventKindDef {
  /** Must match the `kind` string returned by your source canister. */
  id: string;
  /** Human-readable label shown in the activity feed. */
  label: string;
  /** Single character or short string shown as the row glyph. */
  glyph: string;
}

export interface TileValue {
  /** Primary displayed value. */
  value: string;
  /** Optional subtitle / secondary info. */
  sub?: string;
}

export interface TileFetchContext {
  /** The BFF actor. Use to call get_overview(), get_activity(), etc. */
  bff: import("../bindings/explorer_bff/explorer_bff").Explorer_bff;
}

export interface MetricTile {
  /** Unique ID for this tile (used as React key). */
  id: string;
  /** Label shown above the value. */
  label: string;
  /** Async function that fetches and returns the tile value. */
  fetch: (ctx: TileFetchContext) => Promise<TileValue>;
}

export interface EntityDef {
  /**
   * Route type segment, e.g. "account" means this EntityDef handles /e/account/:id.
   * Falls through to generic entity view if no match.
   */
  type: string;
  /** Page title prefix, e.g. "Account". */
  label: string;
  /**
   * Optional custom fetch function. If omitted, the generic entity view
   * calls get_entity(type, id) on the BFF and renders the result.
   */
  fetch?: (ctx: TileFetchContext & { id: string }) => Promise<Record<string, unknown>>;
}
