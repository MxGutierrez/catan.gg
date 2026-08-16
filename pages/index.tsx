import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import s from "@/styles/Home.module.css";
import Board, { ResourceChart } from "@/components/Board";
import FeedbackModal from "@/components/FeedbackModal";
import { RESOURCE_PROBABILITY } from "@/utils/constants";
import {
  LAYOUTS,
  RESOURCE_LABEL,
  Tile,
  balanceScore,
  bestSpots,
  generateBoard,
  offsetsFor,
  pipsByResource,
} from "@/lib/board";

const SITE = "https://catan.gg";

const TITLE = "Catan Board Generator — random Settlers of Catan boards";
const DESCRIPTION =
  "Generate a random Settlers of Catan board in one tap. Supports the classic 19-hex map and the 30-hex map for 5 and 6 players. Every board keeps 6 and 8 apart.";

/**
 * The board rendered into the static HTML. The page swaps it for a random
 * board as soon as it mounts, so the markup stays stable and nothing shifts.
 */
const DEFAULT_BOARD: Tile[] = [
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

const STEPS: [string, string][] = [
  [
    "Pick the set",
    "Choose the classic 19-hex map for 3 and 4 players, or the 30-hex map for 5 and 6 players.",
  ],
  [
    "Shuffle",
    "The generator draws the resource hexes and the number tokens, then checks the layout against the setup rules. If a check fails, it draws again.",
  ],
  [
    "Build the board",
    "Copy the layout onto the table, or leave the phone in the middle of the table and read it from the screen.",
  ],
];

const FAQ: [string, string][] = [
  [
    "How does the generator place the numbers?",
    "It shuffles the 18 resource hexes and the 18 number tokens, adds the desert, then checks every shared edge. A layout passes when no two red numbers touch and no two matching numbers touch. If it fails, the generator draws again.",
  ],
  [
    "Can 6 and 8 touch on a generated board?",
    "No. Every board keeps the 6 and the 8 apart, which matches the setup rule in the printed manual. The same check also keeps two matching numbers off the same edge.",
  ],
  [
    "Does it support the 5–6 player expansion?",
    "Yes. The expansion board uses 30 hexes, 28 number tokens and 2 deserts, and the generator applies the same rules to the larger map.",
  ],
  [
    "What do the dots under each number mean?",
    "The dots are pips. Each pip is one of the 36 combinations that two dice can roll, so a 6 or an 8 carries five pips and a 2 or a 12 carries one.",
  ],
  [
    "How do I read the best spots?",
    "Turn on Best spots. The generator adds the pips of the three hexes around every inland corner, then marks the four highest corners. A corner with a high pip total pays more over a full game.",
  ],
  [
    "Do I need an account?",
    "No. The generator runs in the browser on a phone, a tablet or a laptop. It needs no account, no install and no payment.",
  ],
];

const ODDS: [number, number][] = [
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 5],
  [8, 5],
  [9, 4],
  [10, 3],
  [11, 2],
  [12, 1],
];

const JUMP_LINKS: [string, string][] = [
  ["How it works", "how-it-works"],
  ["Number odds", "number-odds"],
  ["Best spots", "best-spots"],
  ["Setup rules", "setup-rules"],
  ["Questions", "faq"],
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE}/#app`,
      name: "Catan Board Generator",
      url: `${SITE}/`,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description: DESCRIPTION,
      inLanguage: "en",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Random board for the classic 19-hex map",
        "Random board for the 30-hex 5 and 6 player map",
        "Keeps 6 and 8 apart and keeps matching numbers apart",
        "Pip count printed on every number token",
        "Resource balance chart and balance score",
        "Best settlement spots ranked by pip total",
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${SITE}/#howto`,
      name: "How to set up a Catan board with catan.gg",
      description:
        "Draw a legal Settlers of Catan board and copy it onto the table.",
      totalTime: "PT1M",
      step: STEPS.map(([name, text], index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name,
        text,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      mainEntity: FAQ.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function Home() {
  // The mode and the board move together, so a render never pairs one
  // layout with a board drawn for the other.
  const [game, setGame] = useState<{ mode: Mode; board: Tile[] }>({
    mode: "normal",
    board: DEFAULT_BOARD,
  });
  const [showSpots, setShowSpots] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { mode, board } = game;
  const layout = LAYOUTS[mode];
  const offsets = useMemo(() => offsetsFor(layout), [layout]);
  const pips = useMemo(() => pipsByResource(board), [board]);
  const score = useMemo(() => balanceScore(board), [board]);
  const spots = useMemo(
    () => (showSpots ? bestSpots(board, layout, offsets) : []),
    [board, layout, offsets, showSpots]
  );

  const setMode = (next: Mode) =>
    setGame({ mode: next, board: generateBoard(LAYOUTS[next]) });

  const shuffle = () =>
    setGame((current) => ({
      ...current,
      board: generateBoard(LAYOUTS[current.mode]),
    }));

  // Draw a fresh board once the page is interactive. The static HTML keeps
  // the default board, so the first paint needs no work.
  useEffect(() => {
    setGame((current) => ({
      ...current,
      board: generateBoard(LAYOUTS[current.mode]),
    }));
  }, []);

  const tokenCount = layout.nums.length;
  const tileCount = layout.tilesPerRow.reduce((sum, n) => sum + n, 0);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={`${SITE}/`} />
        <meta name="theme-color" content="#1a1209" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="catan.gg" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={`${SITE}/`} />
        <meta property="og:image" content={`${SITE}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="A randomly generated Settlers of Catan board"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE}/og.png`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
      </Head>

      <div className={s.page}>
        <main className={s.app}>
          <div className={s.topbar}>
            <a className={s.brand} href="/">
              catan.gg
            </a>
            <span className={s.meta}>
              {mode === "normal" ? "Classic" : "5–6 player"} · {tileCount} hexes
              · {tokenCount} tokens
            </span>
          </div>

          <div className={s.stage}>
            <div className={s.boardWrap}>
              <Board
                board={board}
                offsets={offsets}
                mode={mode}
                spots={spots}
              />
            </div>

            <div className={s.caption}>
              <h1 className={s.title}>Catan board generator</h1>
              <p className={s.subtitle}>
                {showSpots
                  ? "The marked corners rank by pip total. Number one pays the most over a full game."
                  : "A random Settlers of Catan board, drawn under the rules of the printed manual."}
              </p>
            </div>
          </div>

          <aside className={s.panel} aria-label="Board readings">
            <div className={s.panelLabel}>
              <span>Resource balance</span>
              <span className={s.panelScore}>{score}/100</span>
            </div>

            <ResourceChart
              board={board}
              pips={pips}
              barHeight={64}
              axisColor="rgba(239, 227, 205, 0.2)"
              valueColor="#efe3cd"
            />

            {showSpots && spots.length > 0 && (
              <div className={s.spotList}>
                {spots.map((spot, index) => (
                  <div className={s.spotRow} key={`${spot.left}-${spot.top}`}>
                    <span className={s.spotRank}>{index + 1}</span>
                    <span>
                      {spot.resources.map((r) => RESOURCE_LABEL[r]).join(" · ")}
                    </span>
                    <span className={s.spotPips}>{spot.pips}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <div className={s.hud}>
            <div className={s.seg} role="group" aria-label="Board size">
              <button
                type="button"
                className={clsx(s.segBtn, mode === "normal" && s.segOn)}
                aria-pressed={mode === "normal"}
                onClick={() => setMode("normal")}
              >
                Classic
              </button>
              <button
                type="button"
                className={clsx(s.segBtn, mode === "expanded" && s.segOn)}
                aria-pressed={mode === "expanded"}
                onClick={() => setMode("expanded")}
              >
                5–6 player
              </button>
            </div>

            <button type="button" className={s.shuffle} onClick={shuffle}>
              Shuffle
            </button>

            <button
              type="button"
              className={clsx(s.pill, showSpots && s.pillOn)}
              aria-pressed={showSpots}
              onClick={() => setShowSpots((value) => !value)}
            >
              Best spots
            </button>
          </div>

          <a className={s.scrollCue} href="#how-it-works">
            Read how it works ↓
          </a>
        </main>

        <div className={s.content}>
          <div className={s.inner}>
            <p className={s.answer}>
              <strong>catan.gg draws a random Settlers of Catan board.</strong>{" "}
              It covers the classic 19-hex map for 3 and 4 players and the
              30-hex map for 5 and 6 players. Every board keeps the 6 and the 8
              apart, keeps matching numbers off the same edge, and prints the
              pip count on every token. It is free, it needs no account, and it
              runs in the browser.
            </p>

            <section className={s.section} id="how-it-works">
              <div className={s.kicker}>How it works</div>
              <h2 className={s.h2}>Three steps to a legal board</h2>
              <ol className={s.steps}>
                {STEPS.map(([name, text], index) => (
                  <li className={s.step} key={name}>
                    <div className={s.stepNum}>{index + 1}</div>
                    <h3 className={s.h3}>{name}</h3>
                    <p className={s.stepText}>{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <div className={s.cols}>
              <section className={s.section} id="number-odds">
                <div className={s.kicker}>Number odds</div>
                <h2 className={s.h2}>What each number pays</h2>
                <p className={s.p}>
                  Two dice give 36 combinations. The pips under a number count
                  how many of those combinations produce it, so a 6 or an 8
                  pays five times more often than a 2 or a 12.
                </p>
                <table className={s.table}>
                  <caption>
                    Pips and roll chance for every Catan number token.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Number</th>
                      <th scope="col">Pips</th>
                      <th scope="col">Chance per roll</th>
                      <th scope="col">
                        <span className="sr-only">Bar</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ODDS.map(([num, pipCount]) => (
                      <tr key={num}>
                        <td>{num}</td>
                        <td>{pipCount}</td>
                        <td>{((pipCount / 36) * 100).toFixed(1)}%</td>
                        <td>
                          <span
                            className={s.tableBar}
                            style={{ width: pipCount * 14 }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <div>
                <section className={s.section} id="best-spots">
                  <div className={s.kicker}>Best spots</div>
                  <h2 className={s.h2}>Where to build first</h2>
                  <p className={s.p}>
                    A settlement sits on a corner, and an inland corner touches
                    three hexes. Add the pips of those three hexes and you get
                    what the corner pays. The classic map has 24 inland
                    corners.
                  </p>
                  <p className={s.p}>
                    Turn on <strong>Best spots</strong> in the control bar. The
                    generator ranks every inland corner by pip total and marks
                    the four highest ones on the board.
                  </p>
                </section>

                <section className={s.section} id="setup-rules">
                  <div className={s.kicker}>Setup rules</div>
                  <h2 className={s.h2}>What makes a board legal</h2>
                  <p className={s.p}>
                    A board counts as legal when no two red numbers share an
                    edge and no two matching numbers share an edge. The printed
                    manual states the first rule. The second rule is a common
                    house rule that keeps one number from flooding one corner
                    of the island.
                  </p>
                  <p className={s.p}>
                    The generator checks both rules on every draw, so a board
                    on screen is always ready to copy onto the table.
                  </p>
                </section>
              </div>
            </div>

            <section className={s.section} id="faq">
              <div className={s.kicker}>Questions</div>
              <h2 className={s.h2}>Common questions</h2>
              {FAQ.map(([question, answer]) => (
                <div className={s.faqItem} key={question}>
                  <h3 className={s.h3}>{question}</h3>
                  <p className={s.faqA}>{answer}</p>
                </div>
              ))}

              <div className={s.linkRow}>
                {JUMP_LINKS.map(([label, id]) => (
                  <a className={s.link} href={`#${id}`} key={id}>
                    {label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          <footer className={s.footer}>
            <span>catan.gg · a free Catan board generator</span>
            <button
              type="button"
              className={s.footerBtn}
              onClick={() => setFeedbackOpen(true)}
            >
              Leave feedback
            </button>
          </footer>
        </div>
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
