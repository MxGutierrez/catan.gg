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
  /** How many hexes of each resource the set contains. */
  resources: Record<string, number>;
  nums: number[];
  /** Percentage of the board box that one hex covers. */
  size: number;
};

/** What the generator keeps apart. Every rule is a checkbox on the page. */
export type Filters = {
  reds: boolean;
  lows: boolean;
  sameNumber: boolean;
  sameResource: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  reds: true,
  lows: false,
  sameNumber: true,
  sameResource: false,
};

export const FILTER_LABELS: [keyof Filters, string, string][] = [
  ["reds", "Keep 6 and 8 apart", "The rule the printed manual states."],
  ["lows", "Keep 2 and 12 apart", "Stops both dead corners sitting together."],
  ["sameNumber", "Keep matching numbers apart", "No number twice on one corner."],
  ["sameResource", "Keep matching resources apart", "Breaks up the big blocks."],
];

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

export const CLASSIC: Layout = {
  id: "normal",
  tilesPerRow: [3, 4, 5, 4, 3],
  resources: { ore: 3, brick: 3, sheep: 4, wood: 4, wheat: 4, desert: 1 },
  nums: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
  size: 17.5,
};

export const EXPANSION: Layout = {
  id: "expanded",
  tilesPerRow: [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1],
  resources: { ore: 5, brick: 5, sheep: 6, wood: 6, wheat: 6, desert: 2 },
  nums: [
    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11,
    11, 11, 12, 12,
  ],
  size: 16,
};

export const LAYOUTS: Record<Mode, Layout> = {
  normal: CLASSIC,
  expanded: EXPANSION,
};

export const tileCount = (layout: Layout) =>
  layout.tilesPerRow.reduce((sum, n) => sum + n, 0);

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

export type Offset = { left: number; top: number };

/**
 * Where each hex sits, as a percentage of the square the board is drawn in.
 * Both axes use the same square, so a step across and a step down compare
 * directly.
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
 * Which hexes share an edge, as a neighbour list.
 *
 * The two maps do not use the same grid: the classic map stacks pointy-top
 * hexes in rows, and the expansion map turns them a quarter turn. Reading the
 * neighbours back from the drawn positions keeps one rule for both. Two hexes
 * touch when they sit at the shortest distance any pair of hexes reaches.
 */
export function adjacencyFor(layout: Layout): number[][] {
  const points = offsetsFor(layout);
  const pairs: [number, number, number][] = [];
  let shortest = Infinity;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = Math.hypot(
        points[i].left - points[j].left,
        points[i].top - points[j].top
      );
      pairs.push([i, j, distance]);
      if (distance < shortest) shortest = distance;
    }
  }

  const limit = shortest * 1.25;
  const adjacency: number[][] = points.map(() => []);

  pairs.forEach(([a, b, distance]) => {
    if (distance > limit) return;
    adjacency[a].push(b);
    adjacency[b].push(a);
  });

  return adjacency;
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

/**
 * Fill the positions one at a time, hardest first, and step back whenever a
 * position runs out of pieces. Shuffling and re-checking cannot satisfy the
 * resource rule, so the generator places instead of redrawing.
 */
function fillOnce(
  adjacency: number[][],
  pool: Record<string, number>,
  allowed: (value: string, at: number, placed: (string | null)[]) => boolean,
  budget: number
): string[] | null {
  const total = adjacency.length;

  // Visit the position that already touches the most filled positions. That
  // order finds a dead end early instead of deep in the search.
  const sequence: number[] = [];
  const filled = new Array(total).fill(false);
  const touching = new Array(total).fill(0);

  for (let step = 0; step < total; step++) {
    let best = -1;
    let bestScore = -1;
    shuffle(Array.from({ length: total }, (_, i) => i)).forEach((i) => {
      if (filled[i] || touching[i] <= bestScore) return;
      bestScore = touching[i];
      best = i;
    });
    filled[best] = true;
    sequence.push(best);
    adjacency[best].forEach((j) => touching[j]++);
  }

  const placed: (string | null)[] = new Array(total).fill(null);
  const left = { ...pool };
  let steps = 0;

  const walk = (depth: number): boolean => {
    if (depth === total) return true;
    if (++steps > budget) return false;

    const at = sequence[depth];
    const options = shuffle(Object.keys(left).filter((key) => left[key] > 0));

    for (const value of options) {
      if (!allowed(value, at, placed)) continue;
      left[value]--;
      placed[at] = value;
      if (walk(depth + 1)) return true;
      left[value]++;
      placed[at] = null;
    }

    return false;
  };

  return walk(0) ? (placed as string[]) : null;
}

/** A restart beats a long search: the runtime of one attempt is heavy tailed. */
function fill(
  adjacency: number[][],
  pool: Record<string, number>,
  allowed: (value: string, at: number, placed: (string | null)[]) => boolean
) {
  for (let attempt = 0; attempt < 24; attempt++) {
    const result = fillOnce(adjacency, pool, allowed, 8000);
    if (result) return result;
  }
  return null;
}

const isRed = (num: number) => num === 6 || num === 8;
const isLow = (num: number) => num === 2 || num === 12;

/**
 * Draw a board. Resources go down first, then the number tokens land on the
 * hexes that are not desert.
 */
export function generateBoard(layout: Layout, filters: Filters): Tile[] {
  const adjacency = adjacencyFor(layout);

  const resources = fill(adjacency, layout.resources, (value, at, placed) => {
    if (!filters.sameResource || value === "desert") return true;
    return !adjacency[at].some((j) => placed[j] === value);
  });

  if (!resources) return generateBoard(layout, { ...filters, sameResource: false });

  const spots: number[] = [];
  resources.forEach((resource, index) => {
    if (resource !== "desert") spots.push(index);
  });

  const spotIndex = new Map(spots.map((position, i) => [position, i]));
  const spotAdjacency = spots.map((position) =>
    adjacency[position]
      .filter((j) => spotIndex.has(j))
      .map((j) => spotIndex.get(j) as number)
  );

  const pool: Record<string, number> = {};
  layout.nums.forEach((num) => {
    pool[num] = (pool[num] ?? 0) + 1;
  });

  const numbers = fill(spotAdjacency, pool, (value, at, placed) => {
    const num = Number(value);
    return !spotAdjacency[at].some((j) => {
      const other = placed[j];
      if (other === null) return false;
      const neighbour = Number(other);
      if (filters.reds && isRed(num) && isRed(neighbour)) return true;
      if (filters.lows && isLow(num) && isLow(neighbour)) return true;
      if (filters.sameNumber && num === neighbour) return true;
      return false;
    });
  });

  // Every rule off is always solvable, so this only relaxes an added rule.
  if (!numbers) {
    return generateBoard(layout, {
      reds: filters.reds,
      lows: false,
      sameNumber: false,
      sameResource: filters.sameResource,
    });
  }

  const board: Tile[] = resources.map((resource) => ({
    resource: resource as Resource,
    num: 0,
  }));

  spots.forEach((position, i) => {
    board[position].num = Number(numbers[i]);
  });

  return board;
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
