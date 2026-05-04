import { useSearchParams } from "react-router-dom";
import { useOverview } from "@/hooks/useBffQueries";
import { useQuery } from "@tanstack/react-query";
import { getBff } from "@/lib/bff";
import { LedgerEntry } from "@/components/design/LedgerEntry";
import { OVERVIEW_TILES } from "@/dashboard";

// ── Timestamp formatter ──────────────────────────────────────────────────────
function formatDateTime(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}

// ── Individual metric tile ───────────────────────────────────────────────────

function MetricCard({ tileId, label }: { tileId: string; label: string }) {
  const tile = OVERVIEW_TILES.find((t) => t.id === tileId);
  const { data, isLoading } = useQuery({
    queryKey: ["tile", tileId],
    queryFn: async () => {
      if (!tile) return { value: "—" };
      const bff = getBff();
      return tile.fetch({ bff });
    },
    staleTime: 15_000,
    enabled: !!tile,
  });

  return (
    <div className="bg-vellum-raised border border-quartz rounded-md px-4 py-3 min-w-[160px]">
      <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold tabular-nums font-mono text-ink-primary">
        {isLoading ? "..." : (data?.value ?? "—")}
      </p>
      {data?.sub && <p className="text-[11px] text-ink-muted mt-1 tabular-nums">{data.sub}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function Overview() {
  const { data, isLoading, error } = useOverview();
  const [params] = useSearchParams();
  const unresolved = params.get("q");

  if (isLoading) {
    return <p className="text-ink-muted">Loading overview...</p>;
  }

  if (error) {
    return (
      <div className="bg-cinnabar/10 text-cinnabar border border-cinnabar/20 rounded-md p-4">
        <p className="font-medium">Failed to load overview</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {unresolved && (
        <div className="bg-sodium-soft text-ink-primary border border-sodium/30 rounded-md p-3 mb-6 text-sm">
          Couldn't resolve <span className="font-mono">{unresolved}</span> — try a principal or event id.
        </div>
      )}

      <header className="mb-8 pb-4 border-b border-quartz">
        <h1 className="text-3xl font-semibold tracking-tightest text-ink-primary">Overview</h1>
        <p className="text-sm text-ink-muted mt-1 tabular-nums">
          {formatDateTime(data.generated_at_ns)}
        </p>
      </header>

      {OVERVIEW_TILES.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {OVERVIEW_TILES.map((tile) => (
            <MetricCard key={tile.id} tileId={tile.id} label={tile.label} />
          ))}
        </div>
      )}

      <section>
        <h2 className="text-sm font-medium tracking-[0.08em] uppercase text-ink-muted mb-3">Recent activity</h2>
        <div className="bg-vellum-raised border border-quartz rounded-md overflow-hidden">
          {data.recent_activity.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-muted">No recent activity.</p>
          ) : (
            data.recent_activity.map((e, i) => (
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
