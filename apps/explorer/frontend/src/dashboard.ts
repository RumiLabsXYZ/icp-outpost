import type { MetricTile } from "./lib/types";

/**
 * Define the tiles that appear on the Overview page.
 *
 * Each tile fetches its own data — typically by calling a method on one of
 * your source canisters. The fetch result is rendered as a metric card with
 * label / value / optional subtitle.
 *
 * If you don't want a dashboard, return an empty array and the Overview page
 * will show only the recent activity feed.
 */
export const OVERVIEW_TILES: MetricTile[] = [
  // Example: a "total events" tile
  // {
  //   id: "total_events",
  //   label: "Total events",
  //   fetch: async ({ bff }) => {
  //     const overview = await bff.get_overview();
  //     return { value: String(overview.recent_activity.length) };
  //   },
  // },
];
