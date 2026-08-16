import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import s from "@/styles/Home.module.css";
import Board, { ResourceChart } from "@/components/Board";
import FeedbackModal from "@/components/FeedbackModal";
import {
  DEFAULT_FILTERS,
  FILTER_LABELS,
  Filters,
  LAYOUTS,
  Tile,
  balanceScore,
  generateBoard,
  offsetsFor,
  pipsByResource,
  tileCount,
} from "@/lib/board";

const SITE = "https://catan.gg";

const TITLE = "Catan Board Generator — random Settlers of Catan boards";
const DESCRIPTION =
  "Generate a random Settlers of Catan board in one tap. Classic map and the 5–6 player expansion, with setup rules you can switch on and off.";

/**
 * The board written into the static HTML. The page draws a random one as soon
 * as it mounts, so the markup stays stable and nothing shifts.
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
    "Choose the classic 19-hex map for 3 and 4 players, or the 30-hex expansion for 5 and 6 players.",
  ],
  [
    "Set the rules",
    "Tick what the board must keep apart. The generator places the hexes and the tokens around your choice, and it never settles for a layout that breaks a rule.",
  ],
  [
    "Build the board",
    "Copy the layout onto the table, or leave the phone in the middle of the table and read it from the screen.",
  ],
];

const FAQ: [string, string][] = [
  [
    "How does the generator place the numbers?",
    "It fills the map one hex at a time, hardest position first, and steps back whenever a position runs out of pieces. That is why it can satisfy a rule such as keeping matching resources apart, which shuffling and re-checking almost never reaches.",
  ],
  [
    "Can 6 and 8 touch on a generated board?",
    "Not while the rule is ticked, and it is ticked by default. That rule matches the printed manual. Untick it if you want a wilder map.",
  ],
  [
    "Does it support the 5–6 player expansion?",
    "Yes. The expansion uses 30 hexes, 28 number tokens and 2 deserts, and every rule applies to the larger map as well.",
  ],
  [
    "What do the dots under each number mean?",
    "The dots are pips. Each pip is one of the 36 combinations that two dice can roll, so a 6 or an 8 carries five pips and a 2 or a 12 carries one.",
  ],
  [
    "What is the balance score?",
    "It compares the pip total of each resource against an even split. A board at 100 pays every resource equally. A board at 60 leans hard on one or two of them.",
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
        "Random board for the 30-hex 5 and 6 player expansion",
        "Setup rules for red numbers, low numbers, matching numbers and matching resources",
        "Pip count printed on every number token",
        "Resource balance chart and balance score",
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
  const [mode, setMode] = useState<Mode>("normal");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [draws, setDraws] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // The drawn mode travels with the board, so a render never pairs one
  // layout with a board drawn for the other.
  const [game, setGame] = useState<{ mode: Mode; board: Tile[] }>({
    mode: "normal",
    board: DEFAULT_BOARD,
  });

  // One place draws the board. Every control only states what it wants, so
  // two clicks in the same tick cannot overwrite each other.
  useEffect(() => {
    setGame({ mode, board: generateBoard(LAYOUTS[mode], filters) });
  }, [mode, filters, draws]);

  const { board } = game;
  const layout = LAYOUTS[game.mode];
  const offsets = useMemo(() => offsetsFor(layout), [layout]);
  const pips = useMemo(() => pipsByResource(board), [board]);
  const score = useMemo(() => balanceScore(board), [board]);

  const toggle = (key: keyof Filters) =>
    setFilters((current) => ({ ...current, [key]: !current[key] }));

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={`${SITE}/`} />
        <meta name="theme-color" content="#2b1e12" />

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
        <main className={s.table}>
          <div className={s.head}>
            <a className={s.brand} href="/">
              catan<span>.gg</span>
            </a>
            <span className={s.facts}>
              {game.mode === "normal" ? "Classic" : "Expansion"} ·{" "}
              {tileCount(layout)} hexes · {layout.nums.length} number tokens
            </span>
          </div>

          <div className={s.stage}>
            <div className={s.boardSlot}>
              <div className={s.boardSquare}>
                <Board board={board} offsets={offsets} mode={game.mode} />
              </div>
            </div>

            <div className={s.caption}>
              <h1 className={s.title}>Catan board generator</h1>
              <p className={s.subtitle}>
                Shuffle a board for the classic map or the expansion, and set
                what the layout has to keep apart.
              </p>
            </div>

            <div className={s.slips}>
              <aside className={clsx(s.slip, s.slipLeft)}>
                <h2 className={s.slipTitle}>Setup rules</h2>
                {FILTER_LABELS.map(([key, label, hint]) => (
                  <button
                    type="button"
                    className={s.rule}
                    key={key}
                    aria-pressed={filters[key]}
                    onClick={() => toggle(key)}
                  >
                    <span className={clsx(s.box, filters[key] && s.boxOn)} />
                    <span className={s.ruleText}>
                      {label}
                      <span className={s.ruleHint}>{hint}</span>
                    </span>
                  </button>
                ))}
              </aside>

              <aside className={clsx(s.slip, s.slipRight)}>
                <h2 className={s.slipTitle}>
                  Resource balance
                  <span className={s.slipScore}>{score}/100</span>
                </h2>
                <ResourceChart
                  pips={pips}
                  barHeight={66}
                  axisColor="#cdbd9f"
                  valueColor="#241c14"
                />
              </aside>
            </div>
          </div>

          <div className={s.rail}>
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
                Expansion
              </button>
            </div>

            <button
              type="button"
              className={s.shuffle}
              onClick={() => setDraws((n) => n + 1)}
            >
              Shuffle
            </button>
          </div>
        </main>

        <div className={s.sheet}>
          <div className={s.sheetInner}>
            <p className={s.lead}>
              catan.gg draws a random Settlers of Catan board for the classic
              19-hex map and for the 30-hex expansion for 5 and 6 players.
            </p>
            <p className={s.leadNote}>
              Tick the rules the layout has to obey, press shuffle, and copy
              the board onto the table. Every number token carries its pip
              count, and the slip on the table shows what the board pays per
              resource. It is free, it needs no account, and it runs in the
              browser.
            </p>

            <section className={s.section} id="how-it-works">
              <h2 className={s.h2}>How to set up a board</h2>
              <ol className={s.steps}>
                {STEPS.map(([name, text]) => (
                  <li className={s.step} key={name}>
                    <h3 className={s.h3}>{name}</h3>
                    <p className={s.stepText}>{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <div className={s.cols}>
              <section className={s.section} id="number-odds">
                <h2 className={s.h2}>What each number pays</h2>
                <p className={s.p}>
                  Two dice give 36 combinations. The pips under a number count
                  how many of those combinations produce it, so a 6 or an 8
                  pays five times more often than a 2 or a 12.
                </p>
                <table className={s.table2}>
                  <caption>
                    Pips and roll chance for every Catan number token.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Number</th>
                      <th scope="col">Pips</th>
                      <th scope="col">Chance</th>
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
                            className={s.bar}
                            style={{ width: pipCount * 13 }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className={s.section} id="setup-rules">
                <h2 className={s.h2}>The four setup rules</h2>
                <p className={s.p}>
                  Two rules are ticked when the page loads. The other two are
                  house rules that many groups play with, so they are yours to
                  turn on.
                </p>
                {[
                  [
                    "Keep 6 and 8 apart",
                    "The printed manual states it. The 6 and the 8 pay the most, so a pair of them on one corner decides the game early.",
                  ],
                  [
                    "Keep 2 and 12 apart",
                    "The mirror of the first rule. It stops the two weakest numbers from wasting a whole corner.",
                  ],
                  [
                    "Keep matching numbers apart",
                    "No corner ends up collecting the same number twice on one roll.",
                  ],
                  [
                    "Keep matching resources apart",
                    "It breaks up the large blocks of one resource, which is the usual complaint about a random board.",
                  ],
                ].map(([name, text]) => (
                  <div key={name} style={{ marginBottom: "0.9rem" }}>
                    <h3 className={s.h3}>{name}</h3>
                    <p className={s.stepText}>{text}</p>
                  </div>
                ))}
              </section>
            </div>

            <section className={s.section} id="faq">
              <h2 className={s.h2}>Common questions</h2>
              {FAQ.map(([question, answer]) => (
                <div className={s.faqItem} key={question}>
                  <h3 className={s.h3}>{question}</h3>
                  <p className={s.faqA}>{answer}</p>
                </div>
              ))}
            </section>

            <footer className={s.footer}>
              <span>
                catan.gg is an independent fan tool. CATAN is a trademark of
                its owner.
              </span>
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
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
