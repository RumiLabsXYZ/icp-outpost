import { useHealth } from "@/hooks/useBffQueries";

function formatDuration(seconds: bigint): string {
  const s = Number(seconds);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${Math.floor(s / 86400)}d`;
}

export function Health() {
  const { data, isLoading } = useHealth();

  return (
    <div>
      <header className="mb-8 pb-4 border-b border-quartz">
        <h1 className="text-3xl font-semibold tracking-tightest text-ink-primary">Health</h1>
        <p className="text-sm text-ink-muted mt-1">BFF + source canister state.</p>
      </header>

      {isLoading && <p className="text-ink-muted">Loading...</p>}

      {data && (
        <div className="space-y-4">
          <div className="bg-vellum-raised border border-quartz rounded-md p-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-medium mb-2">Status</p>
            <p className="text-sm text-ink-primary">{data.message}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-vellum-raised border border-quartz rounded-md p-4">
              <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-medium">Source lag</p>
              <p className="text-2xl font-semibold tabular-nums font-mono text-ink-primary mt-1">
                {formatDuration(data.source_lag_seconds)}
              </p>
            </div>
            <div className="bg-vellum-raised border border-quartz rounded-md p-4">
              <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-medium">Any error</p>
              <p className="text-2xl font-semibold tabular-nums font-mono text-ink-primary mt-1">
                {data.any_error ? "yes" : "no"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
