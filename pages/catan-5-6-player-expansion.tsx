import Link from "next/link";
import { useEffect, useState } from "react";
import s from "@/styles/Article.module.css";
import ArticleLayout from "@/components/ArticleLayout";
import Board from "@/components/Board";
import { ARTICLES, SITE } from "@/lib/site";
import {
  CLASSIC,
  DEFAULT_FILTERS,
  EXPANSION,
  Tile,
  adjacencyFor,
  generateBoard,
  offsetsFor,
  tileCount,
} from "@/lib/board";

const META = ARTICLES[2];

/** Written into the static HTML, then redrawn once the page is interactive. */
const SAMPLE: Tile[] = [
  { resource: "wheat", num: 5 },
  { resource: "wood", num: 9 },
  { resource: "ore", num: 4 },
  { resource: "sheep", num: 11 },
  { resource: "brick", num: 8 },
  { resource: "wheat", num: 3 },
  { resource: "desert", num: 0 },
  { resource: "wood", num: 6 },
  { resource: "sheep", num: 10 },
  { resource: "ore", num: 2 },
  { resource: "wheat", num: 9 },
  { resource: "brick", num: 5 },
  { resource: "wood", num: 12 },
  { resource: "sheep", num: 4 },
  { resource: "ore", num: 8 },
  { resource: "wheat", num: 3 },
  { resource: "wood", num: 10 },
  { resource: "brick", num: 6 },
  { resource: "sheep", num: 11 },
  { resource: "desert", num: 0 },
  { resource: "ore", num: 9 },
  { resource: "wheat", num: 4 },
  { resource: "wood", num: 5 },
  { resource: "brick", num: 10 },
  { resource: "sheep", num: 2 },
  { resource: "wheat", num: 8 },
  { resource: "ore", num: 3 },
  { resource: "wood", num: 11 },
  { resource: "brick", num: 12 },
  { resource: "sheep", num: 6 },
];

const COUNTS: [string, string, string][] = [
  ["Hexes", "19", "30"],
  ["Number tokens", "18", "28"],
  ["Deserts", "1", "2"],
  ["Lumber hexes", "4", "6"],
  ["Grain hexes", "4", "6"],
  ["Wool hexes", "4", "6"],
  ["Brick hexes", "3", "5"],
  ["Ore hexes", "3", "5"],
];

const FAQ: [string, string][] = [
  [
    "How many hexes are in the 5–6 player Catan expansion?",
    "The expansion board uses 30 hexes: 6 lumber, 6 grain, 6 wool, 5 brick, 5 ore and 2 deserts. It carries 28 number tokens, one for every hex that is not a desert.",
  ],
  [
    "Can you play the expansion with 4 players?",
    "Yes, and some groups prefer it. The larger map gives everyone more room, so the opening placements fight less. The game runs longer because there is more board to build across.",
  ],
  [
    "Does the expansion change the number distribution?",
    "It adds a third copy of each number from 3 to 11, and a second 2 and 12. The shape of the curve stays the same, so a 6 or an 8 still pays five pips.",
  ],
  [
    "Do the setup rules still apply on the larger map?",
    "Yes. The expansion map has more shared edges than the classic map, so a strict rule set is harder to satisfy, but the same four rules apply.",
  ],
];

export default function Expansion() {
  const [board, setBoard] = useState<Tile[]>(SAMPLE);
  const offsets = offsetsFor(EXPANSION);

  useEffect(() => {
    setBoard(generateBoard(EXPANSION, DEFAULT_FILTERS));
  }, []);

  const classicEdges =
    adjacencyFor(CLASSIC).reduce((sum, list) => sum + list.length, 0) / 2;
  const expansionEdges =
    adjacencyFor(EXPANSION).reduce((sum, list) => sum + list.length, 0) / 2;

  const schema = [
    {
      "@type": "FAQPage",
      "@id": `${SITE}${META.path}#faq`,
      mainEntity: FAQ.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  return (
    <ArticleLayout
      meta={META}
      schema={schema}
      standfirst="The expansion turns a 19-hex island into a 30-hex one. More board, more players, and a shape that is no longer a plain hexagon."
    >
      <p className={s.p}>
        The 5–6 player expansion adds eleven hexes and ten number tokens to the
        base game. The island grows from three rows of hexes to seven columns,
        and it carries a second desert. Everything else about the game stays
        the same.
      </p>

      <figure className={s.figure}>
        <div className={s.board}>
          <Board board={board} offsets={offsets} mode="expanded" />
        </div>
        <figcaption className={s.caption}>
          A generated expansion board. It holds {tileCount(EXPANSION)} hexes in
          columns of 3, 4, 5, 6, 5, 4 and 3.
        </figcaption>
      </figure>

      <h2 className={s.h2}>What is in the box</h2>
      <table className={s.table}>
        <caption>Piece counts, classic map against the expansion.</caption>
        <thead>
          <tr>
            <th scope="col">Piece</th>
            <th scope="col">Classic</th>
            <th scope="col">Expansion</th>
          </tr>
        </thead>
        <tbody>
          {COUNTS.map(([name, classic, expansion]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{classic}</td>
              <td>{expansion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={s.h2}>The number tokens</h2>
      <p className={s.p}>
        The expansion carries three copies of every number from 3 to 11, and
        two copies each of the 2 and the 12. That is 28 tokens against the 18
        of the classic map. The pip values do not change, so a 6 still pays
        five pips and a 12 still pays one.
      </p>
      <p className={s.p}>
        Because there are three 6 tokens and three 8 tokens instead of two,
        the strongest hexes are less concentrated. Every player usually
        reaches at least one of them.
      </p>

      <h2 className={s.h2}>A different shape, not a bigger hexagon</h2>
      <p className={s.p}>
        The classic island is a regular hexagon: rows of 3, 4, 5, 4 and 3. The
        expansion is wider than it is tall, in columns of 3, 4, 5, 6, 5, 4 and
        3. The hexes also sit a quarter turn from the classic layout.
      </p>
      <p className={s.p}>
        That shape matters for setup. The classic map has {classicEdges} shared
        edges between hexes. The expansion has {expansionEdges}. More edges
        means more places for a rule to fail, so a strict rule set takes more
        work to satisfy on the larger map.
      </p>

      <div className={s.note}>
        The expansion also changes the turn order. Play passes around the table
        as usual, but a special build phase lets everyone build after each
        turn, which keeps five and six player games from dragging.
      </div>

      <h2 className={s.h2}>Should you play it with four?</h2>
      <p className={s.p}>
        A four player game on the larger map gives each player more room, so
        the opening placements collide less and the early game is calmer. The
        trade is length: there is more board to cross, and the game runs
        longer. Many groups keep the classic map for a quick evening and the
        expansion when they have time.
      </p>

      <h2 className={s.h2}>Common questions</h2>
      {FAQ.map(([question, answer]) => (
        <div key={question}>
          <h3 className={s.h3}>{question}</h3>
          <p className={s.p}>{answer}</p>
        </div>
      ))}

      <p className={s.p}>
        The generator draws expansion boards under the same rules as the
        classic map. Press Expansion on the control rail, or read{" "}
        <Link href="/catan-setup-rules">the setup rules</Link> first.
      </p>

      <Link className={s.cta} href="/">
        Open the board generator
      </Link>
    </ArticleLayout>
  );
}
