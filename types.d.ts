type Mode = "normal" | "expanded";

type Resource = "wood" | "brick" | "sheep" | "wheat" | "ore" | "desert";

interface Tile {
  resource: Resource;
  num: number;
}

type Board = Tile[];
