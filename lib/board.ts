import { RESOURCE_PROBABILITY } from "@/utils/constants";

export type Resource = "wood" | "brick" | "sheep" | "wheat" | "ore" | "desert";

export type Tile = {
  resource: Resource;
  /** 0 marks the desert, which carries no number token. */
  num: number;
};

export type Layout = {
  id: Mode;
  tilesPerRow: number[];
  resources: Resource[];
  nums: number[];
  deserts: number;
  /** Percentage of the board width that one hex covers. */
  size: number;
};

export const RESOURCE_ORDER: Resource[] = [
  "wood",
  "brick",
  "sheep",
  "wheat",
  "ore",
];

export const RESOURCE_LABEL: Record<string, string> = {
  wood: "Lumber",
  brick: "Brick",
  sheep: "Wool",
  wheat: "Grain",
  ore: "Ore",
  desert: "Desert",
};

/** The colours the resource chart has always used. */
export const RESOURCE_COLOR: Record<string, string> = {
  wood: "#668f57",
  brick: "#f5b027",
  sheep: "#aede1f",
  wheat: "#f5cf3b",
  ore: "#d6d0ce",
};

const times = <T,>(value: T, count: number): T[] =>
  Array.from({ length: count }, () => value);

export const CLASSIC: Layout = {
  id: "normal",
  tilesPerRow: [3, 4, 5, 4, 3],
  resources: [
    ...times<Resource>("ore", 3),
    ...times<Resource>("brick", 3),
    ...times<Resource>("sheep", 4),
    ...times<Resource>("wood", 4),
    ...times<Resource>("wheat", 4),
  ],
  nums: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
  deserts: 1,
  size: 17.5,
};

export const EXPANSION: Layout = {
  id: "expanded",
  tilesPerRow: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
  resources: [
    ...times<Resource>("ore", 5),
    ...times<Resource>("brick", 5),
    ...times<Resource>("sheep", 6),
    ...times<Resource>("wood", 6),
    ...times<Resource>("wheat", 6),
  ],
  nums: [
    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11,
    11, 11, 12, 12,
  ],
  deserts: 2,
  size: 16,
};

export const LAYOUTS: Record<Mode, Layout> = {
  normal: CLASSIC,
  expanded: EXPANSION,
};

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

export type Offset = { left: number; top: number };

/**
 * Where each hex sits, as a percentage of the board box. The maths matches
 * the artwork, so the tiles land inside the printed sea frame.
 */
export function offsetsFor(layout: Layout): Offset[] {
  const { size, tilesPerRow } = layout;
  const r = 0.866025404 * size;
  const centerRow = Math.floor(tilesPerRow.length / 2);

  let rowStep = 0.73 * size;
  let cellStep = 0.99 * r;

  if (layout.id === "expanded") {
    cellStep = 1.51 * size * 0.99;
    rowStep = r / 1.99;
  }

  const offsets: Offset[] = [];

  for (let i = 0; i < tilesPerRow.length; i++) {
    const y = 50 + (i - centerRow) * rowStep;
    const evenShift = ((i % 2) * cellStep) / 2;
    const firstShift = Math.floor(tilesPerRow[i] / 2) * cellStep;

    for (let e = 0; e < tilesPerRow[i]; e++) {
      offsets.push({ left: 50 - firstShift + evenShift + e * cellStep, top: y });
    }
  }

  return offsets;
}

/**
 * Every pair of hexes that shares an edge, as "low:high" keys.
 *
 * The two maps do not use the same grid: the classic map stacks pointy-top
 * hexes in rows, and the expansion map turns them a quarter turn. Reading the
 * neighbours back from the drawn positions keeps one rule for both. Two hexes
 * touch when they sit at the shortest distance any pair of hexes reaches.
 */
export function neighboursFor(layout: Layout): Set<string> {
  // The board box is wider than it is tall, so scale the vertical axis before
  // the distances mean anything.
  const points = offsetsFor(layout).map((offset) => ({
    x: offset.left,
    y: offset.top * 0.866025404,
  }));

  const distances: [number, number, number][] = [];
  let shortest = Infinity;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = Math.hypot(
        points[i].x - points[j].x,
        points[i].y - points[j].y
      );
      distances.push([i, j, distance]);
      if (distance < shortest) shortest = distance;
    }
  }

  const limit = shortest * 1.25;
  const pairs = new Set<string>();

  distances.forEach(([a, b, distance]) => {
    if (distance <= limit) pairs.add(`${a}:${b}`);
  });

  return pairs;
}

/** Every corner where three hexes meet. Those are the inland build spots. */
export function cornersFor(layout: Layout): number[][] {
  const neighbours = neighboursFor(layout);
  const touches = (a: number, b: number) =>
    neighbours.has(`${Math.min(a, b)}:${Math.max(a, b)}`);

  const total = layout.tilesPerRow.reduce((sum, n) => sum + n, 0);
  const corners: number[][] = [];

  for (let a = 0; a < total; a++) {
    for (let b = a + 1; b < total; b++) {
      if (!touches(a, b)) continue;
      for (let c = b + 1; c < total; c++) {
        if (touches(a, c) && touches(b, c)) corners.push([a, b, c]);
      }
    }
  }

  return corners;
}

/* ------------------------------------------------------------------ */
/* Generation                                                          */
/* ------------------------------------------------------------------ */

function shuffle<T>(input: T[]): T[] {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const isRed = (num: number) => num === 6 || num === 8;

/** A board is legal when no two red numbers and no two equal numbers touch. */
function isLegal(board: Tile[], edges: string[], checkSameNumber: boolean) {
  for (const edge of edges) {
    const [a, b] = edge.split(":").map(Number);
    const left = board[a].num;
    const right = board[b].num;

    if (isRed(left) && isRed(right)) return false;
    if (checkSameNumber && left !== 0 && left === right) return false;
  }
  return true;
}

const MAX_ATTEMPTS = 12000;

/**
 * Draw a board. The generator shuffles the hexes and the tokens, then checks
 * the layout against the setup rules. If a check fails, it draws again.
 */
export function generateBoard(layout: Layout): Tile[] {
  const edges = Array.from(neighboursFor(layout));

  const draw = () => {
    const resources = shuffle(layout.resources);
    const nums = shuffle(layout.nums);
    const tiles: Tile[] = resources.map((resource, index) => ({
      resource,
      num: nums[index],
    }));

    for (let i = 0; i < layout.deserts; i++) {
      tiles.push({ resource: "desert", num: 0 });
    }

    return shuffle(tiles);
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const board = draw();
    if (isLegal(board, edges, true)) return board;
  }

  // The strict draw did not land. Keep the red numbers apart, which is the
  // rule the printed manual states, and let equal numbers touch.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const board = draw();
    if (isLegal(board, edges, false)) return board;
  }

  return draw();
}

/* ------------------------------------------------------------------ */
/* Readings                                                            */
/* ------------------------------------------------------------------ */

/** Pip total per resource. One pip is one of the 36 dice combinations. */
export function pipsByResource(board: Tile[]) {
  const totals: Record<string, number> = {
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

export type Spot = {
  pips: number;
  resources: Resource[];
  left: number;
  top: number;
};

/** Rank the corners by pip total, the way a player picks a first settlement. */
export function bestSpots(
  board: Tile[],
  layout: Layout,
  offsets: Offset[],
  count = 4
): Spot[] {
  return cornersFor(layout)
    .filter((corner) => corner.every((i) => board[i]))
    .map((corner) => {
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
        left: corner.reduce((sum, i) => sum + offsets[i].left, 0) / 3,
        top: corner.reduce((sum, i) => sum + offsets[i].top, 0) / 3,
      };
    })
    .sort((a, b) => b.pips - a.pips || b.resources.length - a.resources.length)
    .slice(0, count);
}

/**
 * How even a board is, from 0 to 100. It compares the pip spread per
 * resource against a perfectly even split of the same total.
 */
export function balanceScore(board: Tile[]): number {
  const pips = Object.values(pipsByResource(board));
  const total = pips.reduce((sum, value) => sum + value, 0);
  if (!total) return 0;

  const even = total / pips.length;
  const spread =
    pips.reduce((sum, value) => sum + Math.abs(value - even), 0) / pips.length;

  return Math.max(0, Math.min(100, Math.round(100 - (spread / even) * 100)));
}
