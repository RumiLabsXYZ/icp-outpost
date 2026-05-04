import { useParams } from "react-router-dom";
import { useEntity } from "@/hooks/useBffQueries";
import { LedgerEntry } from "@/components/design/LedgerEntry";
import { ENTITIES } from "@/entities";

export function EntityDetail() {
  const { type = "entity", id = "" } = useParams<{ type: string; id: string }>();

  // Check if there's a custom entity def for this type
  const entityDef = ENTITIES.find((e) => e.type === type);
  const displayLabel = entityDef?.label ?? type;

  const { data, isLoading, error } = useEntity(type, id);

  if (!id) return <p className="text-ink-muted">No id in URL.</p>;

  if (isLoading) return <p className="text-ink-muted">Loading...</p>;

  if (error) {
    return (
      <div className="bg-cinnabar/10 text-cinnabar border border-cinnabar/20 rounded-md p-4">
        <p className="font-medium">Failed to load {displayLabel}</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <header className="mb-8 pb-4 border-b border-quartz">
        <h1 className="text-3xl font-semibold tracking-tightest text-ink-primary">{displayLabel}</h1>
        <p className="text-sm font-mono text-ink-muted mt-1 break-all">{data.display_label}</p>
      </header>

      <section>
        <h2 className="text-sm font-medium tracking-[0.08em] uppercase text-ink-muted mb-3">Recent activity</h2>
        <div className="bg-vellum-raised border border-quartz rounded-md overflow-hidden">
          {data.recent_events.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-muted">No events found for this entity.</p>
          ) : (
            data.recent_events.map((e, i) => (
              <LedgerEntry
                key={`${e.global_id}-${i}`}
                timestampNs={e.timestamp_ns}
                kind={e.kind}
                summary={e.payload_summary}
                amount={e.primary_amount?.formatted ?? null}
                id={e.global_id}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
