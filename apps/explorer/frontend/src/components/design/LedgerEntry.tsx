import type { ReactNode } from "react";
import { getEventKind } from "@/events";

interface Props {
  /** Nanosecond timestamp from the candid record. */
  timestampNs: bigint;
  /** Action kind, e.g. "transfer", "create". Must match an id in events.ts. */
  kind: string;
  /** One-line summary text. */
  summary: string;
  /** Pre-formatted amount text. Pass null for actions without an amount. */
  amount?: string | null;
  /** Optional ID badge (e.g., "main:42"). */
  id?: string;
  /** Optional click handler, makes the whole row interactive. */
  onClick?: () => void;
  /** Optional trailing chip (custom react node, e.g., status). */
  trailing?: ReactNode;
}

function formatLedgerTime(ns: bigint): { date: string; time: string } {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return { date, time };
}

export function LedgerEntry({
  timestampNs,
  kind,
  summary,
  amount,
  id,
  onClick,
  trailing,
}: Props) {
  const { date, time } = formatLedgerTime(timestampNs);
  // Look up glyph and label from user-defined events.ts — no hardcoded map.
  const kindDef = getEventKind(kind);
  const glyph = kindDef?.glyph ?? "·";
  const label = kindDef?.label ?? kind;

  const interactive = !!onClick;

  return (
    <div
      onClick={onClick}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter") onClick?.(); } : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      className={[
        "grid grid-cols-[auto_auto_1fr_auto] gap-4 items-baseline",
        "px-4 py-2.5 text-sm",
        "border-b border-quartz",
        interactive && "cursor-pointer hover:bg-vellum-inset",
      ].filter(Boolean).join(" ")}
    >
      <div className="font-mono text-[11px] tabular-nums text-ink-muted whitespace-nowrap">
        <span>{date}</span>
        <span className="ml-2 opacity-70">{time}</span>
      </div>
      <div
        className="text-ink-secondary tabular-nums w-4 text-center"
        aria-hidden="true"
        title={label}
      >
        {glyph}
      </div>
      <div className="text-ink-primary leading-snug">
        <span className="text-ink-secondary mr-2">{label}</span>
        <span className="text-ink-muted">{summary}</span>
      </div>
      <div className="text-right flex items-center gap-3">
        {trailing}
        {amount && <span className="font-mono tabular-nums text-ink-primary">{amount}</span>}
        {id && <span className="font-mono tabular-nums text-[11px] text-ink-disabled">{id}</span>}
      </div>
    </div>
  );
}
