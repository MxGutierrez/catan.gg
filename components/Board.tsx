import clsx from "clsx";
import s from "@/styles/Board.module.css";
import { RESOURCE_PROBABILITY } from "@/utils/constants";
import {
  Offset,
  RESOURCE_COLOR,
  RESOURCE_LABEL,
  RESOURCE_ORDER,
  Tile,
} from "@/lib/board";

interface BoardProps {
  board: Tile[];
  offsets: Offset[];
  mode: Mode;
}

/** The sea frame is the largest paint on the page, so it loads first. */
export default function Board({ board, offsets, mode }: BoardProps) {
  if (!board.length || !offsets.length) return <div className={s.board} />;

  return (
    <div className={s.board}>
      {mode === "normal" && (
        <picture className={s.frame}>
          <source
            srcSet="/images/background-1x.webp 1x, /images/background-2x.webp 2x"
            type="image/webp"
          />
          <img
            src="/images/background-1x.png"
            srcSet="/images/background-1x.png 1x, /images/background-2x.png 2x"
            alt=""
            aria-hidden="true"
            {...{ fetchpriority: "high" }}
          />
        </picture>
      )}

      {board.map((tile, index) => (
        <div
          key={index}
          className={clsx(
            s.tile,
            mode === "normal" ? s.tileNormal : s.tileExpanded
          )}
          style={{
            left: `${offsets[index]?.left}%`,
            top: `${offsets[index]?.top}%`,
          }}
        >
          <div className={s.tileInner}>
            <picture className={s.tilePic}>
              <source
                srcSet={`/images/${tile.resource}-1x.webp 1x, /images/${tile.resource}-2x.webp 2x, /images/${tile.resource}-3x.webp 3x, /images/${tile.resource}-4x.webp 4x`}
                type="image/webp"
              />
              <img
                src={`/images/${tile.resource}-1x.png`}
                srcSet={`/images/${tile.resource}-1x.png 1x, /images/${tile.resource}-2x.png 2x, /images/${tile.resource}-3x.png 3x, /images/${tile.resource}-4x.png 4x`}
                alt=""
                aria-hidden="true"
              />
            </picture>

            {tile.resource !== "desert" && (
              <div
                className={clsx(s.token, {
                  [s.tokenHot]: tile.num === 6 || tile.num === 8,
                  [s.tokenExpanded]: mode === "expanded",
                })}
              >
                <span
                  className={clsx(s.tokenNum, {
                    [s.tokenNumWide]: tile.num >= 10,
                  })}
                >
                  {tile.num}
                </span>
                <span className={s.tokenPips} aria-hidden="true">
                  {Array.from({ length: RESOURCE_PROBABILITY[tile.num] ?? 0 })
                    .map(() => ".")
                    .join("")}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChartProps {
  pips: Record<string, number>;
  showNames?: boolean;
  barHeight?: number;
  axisColor?: string;
  valueColor?: string;
}

/**
 * Pip total per resource. The number under a hex counts how many of the 36
 * dice combinations produce it, so the bar shows what the board pays.
 */
export function ResourceChart({
  pips,
  showNames = false,
  barHeight = 72,
  axisColor,
  valueColor,
}: ChartProps) {
  const max = Math.max(1, ...Object.values(pips));

  return (
    <div className={s.chart} style={{ color: axisColor }}>
      {RESOURCE_ORDER.map((resource) => (
        <div className={s.chartCol} key={resource}>
          <span className={s.chartVal} style={{ color: valueColor }}>
            {pips[resource] ?? 0}
          </span>
          <span className={s.chartTrack} style={{ height: barHeight }}>
            <span
              className={s.chartFill}
              style={{
                height: `${((pips[resource] ?? 0) / max) * 100}%`,
                background: RESOURCE_COLOR[resource],
              }}
            />
          </span>
          <picture>
            <source
              srcSet={`/images/${resource}-resource.webp`}
              type="image/webp"
            />
            <img
              className={s.chartIcon}
              src={`/images/${resource}-resource.png`}
              alt={RESOURCE_LABEL[resource]}
            />
          </picture>
          {showNames && (
            <span className={s.chartName} style={{ color: valueColor }}>
              {RESOURCE_LABEL[resource]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
