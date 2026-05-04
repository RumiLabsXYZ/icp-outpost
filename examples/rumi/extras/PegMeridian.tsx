import { ReferenceLine, type LabelProps } from "recharts";
import type { ReactElement } from "react";

interface Props {
  /** Y-axis value that represents the peg target (typically 1 for $1.00). */
  y: number;
  /** Optional label rendered as a small annotation on the right edge. */
  label?: string;
}

/**
 * The peg meridian — a 1px reference line at the protocol's peg target.
 * Always quiet, never demanding attention. Anchors every chart where the
 * peg is meaningful (price, virtual price, peg series).
 *
 * Render this as a sibling to <Area>/<Line> inside a recharts chart.
 *
 * Rumi signature component — not part of the base template.
 */
export function PegMeridian({ y, label = "peg" }: Props): ReactElement {
  return (
    <ReferenceLine
      y={y}
      stroke="hsl(210 38% 42% / 0.45)"
      strokeDasharray="3 3"
      strokeWidth={1}
      ifOverflow="extendDomain"
      label={{
        value: label,
        position: "right",
        offset: 6,
        fill: "hsl(210 38% 42%)",
        fontSize: 10,
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
      } satisfies LabelProps}
    />
  );
}
