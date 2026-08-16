import clsx from "clsx";
import b from "@/styles/MockBoard.module.css";
import { RESOURCE_COLOR as COLORS, RESOURCE_LABEL as LABELS } from "@/lib/board";

export { RESOURCE_COLOR, RESOURCE_LABEL } from "@/lib/board";
import { RESOURCE_PROBABILITY } from "@/utils/constants";


/* ------------------------------------------------------------------ */
/* Board data — one fixed classic layout, so every mockup shows the    */
/* same board and the comparison stays about the design.               */
/* ------------------------------------------------------------------ */

export type MockTile = { resource: string; num: number };

export const FIXED_BOARD: MockTile[] = [
  { resource: "ore", num: 10 },
  { resource: "sheep", num: 2 },
  { resource: "wood", num: 9 },
  { resource: "wheat", num: 12 },
  { resource: "brick", num: 6 },
  { resource: "sheep", num: 4 },
  { resource: "brick", num: 10 },
  { resource: "wheat", num: 9 },
  { resource: "wood", num: 11 },
  { resource: "desert", num: 0 },
  { resource: "wood", num: 3 },
  { resource: "ore", num: 8 },
  { resource: "wood", num: 8 },
  { resource: "ore", num: 3 },
  { resource: "wheat", num: 4 },
  { resource: "sheep", num: 5 },
  { resource: "brick", num: 5 },
  { resource: "wheat", num: 6 },
  { resource: "sheep", num: 11 },
];

/** The order the resource chart uses. */
export const RESOURCE_ORDER = ["wood", "brick", "sheep", "wheat", "ore"];

const TILE_SIZE = 17.5;
const ROWS = [3, 4, 5, 4, 3];

function classicOffsets() {
  const r = 0.866025404 * TILE_SIZE;
  const rowStep = 0.73 * TILE_SIZE;
  const centerRow = Math.floor(ROWS.length / 2);
  const cellStep = 0.99 * r;
  const offsets: { left: number; top: number }[] = [];

  for (let i = 0; i < ROWS.length; i++) {
    const y = 50 + (i - centerRow) * rowStep;
    const evenShift = ((i % 2) * cellStep) / 2;
    const firstShift = Math.floor(ROWS[i] / 2) * cellStep;

    for (let e = 0; e < ROWS[i]; e++) {
      offsets.push({ left: 50 - firstShift + evenShift + e * cellStep, top: y });
    }
  }
  return offsets;
}

export const OFFSETS = classicOffsets();

/** Tile indexes grouped per row, in the same order the offsets are built. */
const ROW_INDEXES = (() => {
  const rows: number[][] = [];
  let cursor = 0;
  ROWS.forEach((count) => {
    const row: number[] = [];
    for (let e = 0; e < count; e++) row.push(cursor++);
    rows.push(row);
  });
  return rows;
})();

/** Every pair of hexes that shares an edge. */
const NEIGHBOURS = (() => {
  const pairs = new Set<string>();
  const add = (a: number, c: number) =>
    pairs.add(`${Math.min(a, c)}:${Math.max(a, c)}`);

  ROWS.forEach((count, row) => {
    for (let e = 0; e + 1 < count; e++) {
      add(ROW_INDEXES[row][e], ROW_INDEXES[row][e + 1]);
    }
  });

  for (let row = 0; row + 1 < ROWS.length; row++) {
    const growing = ROWS[row + 1] > ROWS[row];
    for (let e = 0; e < ROWS[row]; e++) {
      const partners = growing ? [e, e + 1] : [e - 1, e];
      partners.forEach((p) => {
        if (p >= 0 && p < ROWS[row + 1]) {
          add(ROW_INDEXES[row][e], ROW_INDEXES[row + 1][p]);
        }
      });
    }
  }
  return pairs;
})();

const touches = (a: number, c: number) =>
  NEIGHBOURS.has(`${Math.min(a, c)}:${Math.max(a, c)}`);

/** The 24 inland corners: every set of three hexes that all touch. */
const CORNERS = (() => {
  const corners: number[][] = [];
  for (let a = 0; a < 19; a++) {
    for (let c = a + 1; c < 19; c++) {
      if (!touches(a, c)) continue;
      for (let d = c + 1; d < 19; d++) {
        if (touches(a, d) && touches(c, d)) corners.push([a, c, d]);
      }
    }
  }
  return corners;
})();

/** Pips per resource across the whole board. */
export function pipsByResource(board: MockTile[]) {
  const totals: { [key: string]: number } = {
    wood: 0,
    brick: 0,
    sheep: 0,
    wheat: 0,
    ore: 0,
  };
  board.forEach((tile) => {
    if (tile.resource === "desert") return;
    totals[tile.resource] += RESOURCE_PROBABILITY[tile.num] ?? 0;
  });
  return totals;
}

/** Rank the corners by pip total, the way a player picks a first settlement. */
export function bestSpots(board: MockTile[]) {
  return CORNERS.map((corner) => {
    const tiles = corner.map((i) => board[i]);
    const pips = tiles.reduce(
      (total, tile) => total + (RESOURCE_PROBABILITY[tile.num] ?? 0),
      0
    );
    const resources = Array.from(
      new Set(
        tiles.filter((t) => t.resource !== "desert").map((t) => t.resource)
      )
    );
    return {
      pips,
      resources,
      left: corner.reduce((sum, i) => sum + OFFSETS[i].left, 0) / 3,
      top: corner.reduce((sum, i) => sum + OFFSETS[i].top, 0) / 3,
    };
  })
    .sort((a, c) => c.pips - a.pips || c.resources.length - a.resources.length)
    .slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* Renderers                                                           */
/* ------------------------------------------------------------------ */

export function Board({
  board = FIXED_BOARD,
  spots = [],
  className,
}: {
  board?: MockTile[];
  spots?: ReturnType<typeof bestSpots>;
  className?: string;
}) {
  return (
    <div className={clsx(b.board, className)}>
      <picture>
        <source
          srcSet="/images/background-1x.webp 1x, /images/background-2x.webp 2x"
          type="image/webp"
        />
        <img
          src="/images/background-1x.png"
          alt="Catan board sea and harbour frame"
        />
      </picture>

      {board.map((tile, index) => (
        <div
          key={index}
          className={b.tile}
          style={{
            left: `${OFFSETS[index].left}%`,
            top: `${OFFSETS[index].top}%`,
          }}
        >
          <div className={b.tileInner}>
            <picture className={b.tilePic}>
              <source
                srcSet={`/images/${tile.resource}-1x.webp 1x, /images/${tile.resource}-2x.webp 2x, /images/${tile.resource}-3x.webp 3x, /images/${tile.resource}-4x.webp 4x`}
                type="image/webp"
              />
              <img
                src={`/images/${tile.resource}-1x.png`}
                srcSet={`/images/${tile.resource}-1x.png 1x, /images/${tile.resource}-2x.png 2x, /images/${tile.resource}-3x.png 3x, /images/${tile.resource}-4x.png 4x`}
                alt={`${tile.resource} hex`}
              />
            </picture>

            {tile.resource !== "desert" && (
              <div
                className={clsx(b.token, {
                  [b.tokenHot]: tile.num === 6 || tile.num === 8,
                })}
              >
                <span
                  className={clsx(b.tokenNum, {
                    [b.tokenNumWide]: tile.num >= 10,
                  })}
                >
                  {tile.num}
                </span>
                <span className={b.tokenPips}>
                  {Array.from({ length: RESOURCE_PROBABILITY[tile.num] }).map(
                    (_, i) => (
                      <span key={i}>.</span>
                    )
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {spots.map((spot, index) => (
        <div
          key={index}
          className={b.spotDot}
          style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
        >
          <span className={b.spotDotRank}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The resource balance chart the app already ships, drawn as plain bars so
 * each direction can skin it. The value is the pip total per resource.
 */
export function ResourceBars({
  showNames = false,
  barHeight = 86,
  axisColor,
  valueColor,
}: {
  showNames?: boolean;
  barHeight?: number;
  axisColor?: string;
  valueColor?: string;
}) {
  const pips = pipsByResource(FIXED_BOARD);
  const max = Math.max(...Object.values(pips));

  return (
    <div className={b.rbar} style={{ color: axisColor }}>
      {RESOURCE_ORDER.map((resource) => (
        <div className={b.rbarCol} key={resource}>
          <span className={b.rbarVal} style={{ color: valueColor }}>
            {pips[resource]}
          </span>
          <span className={b.rbarTrack} style={{ height: barHeight }}>
            <span
              className={b.rbarFill}
              style={{
                height: `${(pips[resource] / max) * 100}%`,
                background: COLORS[resource],
              }}
            />
          </span>
          <picture>
            <source
              srcSet={`/images/${resource}-resource.webp`}
              type="image/webp"
            />
            <img
              className={b.rbarIcon}
              src={`/images/${resource}-resource.png`}
              alt={LABELS[resource]}
            />
          </picture>
          {showNames && (
            <span className={b.rbarName} style={{ color: valueColor }}>
              {LABELS[resource]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
