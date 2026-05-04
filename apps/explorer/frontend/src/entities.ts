import type { EntityDef } from "./lib/types";

/**
 * Define custom entity routes here. Each entity is a route like
 * /e/{type}/[id] that fetches your custom data and renders it.
 *
 * If you don't define entities here, the explorer falls back to a generic
 * "recent events for this entity" view at /e/entity/[id].
 */
export const ENTITIES: EntityDef[] = [];
