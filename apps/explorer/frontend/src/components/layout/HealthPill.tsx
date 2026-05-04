import { useHealth } from "@/hooks/useBffQueries";

export function HealthPill() {
  const { data, isLoading } = useHealth();

  if (isLoading || !data) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-vellum-inset text-ink-disabled rounded-full px-2.5 py-0.5 text-xs font-medium border border-quartz">
        <span className="w-1.5 h-1.5 bg-ink-disabled rounded-full"></span>
        Loading
      </span>
    );
  }

  // Candid variant tag: `level` is `{ 'Green': null } | { 'Yellow': null } | { 'Red': null }`
  const level = data.level as unknown as { Green?: null; Yellow?: null; Red?: null };
  const levelKey: "green" | "yellow" | "red" =
    level.Green !== undefined ? "green" : level.Yellow !== undefined ? "yellow" : "red";

  const styles = {
    green: {
      bg: "bg-verdigris/10",
      text: "text-verdigris",
      dot: "bg-verdigris",
      border: "border-verdigris/20",
      label: "Healthy",
    },
    yellow: {
      bg: "bg-sodium/10",
      text: "text-sodium",
      dot: "bg-sodium",
      border: "border-sodium/20",
      label: "Degraded",
    },
    red: {
      bg: "bg-cinnabar/10",
      text: "text-cinnabar",
      dot: "bg-cinnabar",
      border: "border-cinnabar/20",
      label: "Unhealthy",
    },
  }[levelKey];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${styles.bg} ${styles.text} rounded-full px-2.5 py-0.5 text-xs font-medium border ${styles.border}`}
      title={data.message}
    >
      <span className={`w-1.5 h-1.5 ${styles.dot} rounded-full`}></span>
      {styles.label}
    </span>
  );
}
