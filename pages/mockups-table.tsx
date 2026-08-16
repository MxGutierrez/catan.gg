import Head from "next/head";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Barlow_Condensed, Bitter, Cormorant_Garamond, Inter } from "@next/font/google";
import shell from "@/styles/Mockups.module.css";
import t from "@/styles/MockupsTable.module.css";
import {
  Board,
  FIXED_BOARD,
  ResourceBars,
  bestSpots,
} from "@/components/mock/MockBoard";

const inter = Inter({ subsets: ["latin"] });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"] });
const bitter = Bitter({ subsets: ["latin"], weight: ["400", "600"] });

/* ------------------------------------------------------------------ */
/* Copy shared by the four versions                                    */
/* ------------------------------------------------------------------ */

const ANSWER =
  "catan.gg draws a random Settlers of Catan board for the classic 19-hex map or the 30-hex map for 5 and 6 players. It keeps 6 and 8 apart, prints the pip count on every token, and needs one tap.";

const STEPS: [string, string][] = [
  [
    "Pick the set",
    "Choose the classic 19-hex map, or the 30-hex map for 5 and 6 players.",
  ],
  [
    "Shuffle",
    "The generator draws the hexes and the number tokens, then checks the layout against the setup rules.",
  ],
  [
    "Build the board",
    "Copy the layout onto the table, or leave the phone in the middle and read it from there.",
  ],
];

const FAQ: [string, string][] = [
  [
    "How does the generator place the numbers?",
    "The generator shuffles the 18 number tokens and the 18 resource hexes, then checks the layout against the rules you switch on. If a check fails, it draws again.",
  ],
  [
    "Can 6 and 8 touch on a generated board?",
    "Only if you allow it. The default board keeps every 6 and 8 apart, which matches the setup rule in the printed manual.",
  ],
  [
    "Does it support the 5–6 player expansion?",
    "Yes. The expansion board uses 30 hexes and 28 number tokens, and the generator applies the same rules to the larger map.",
  ],
  [
    "Do I need to install anything?",
    "No. The generator runs in the browser on a phone, a tablet, or a laptop, and it works with no account.",
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

const LINKS = [
  "Catan dice roll tracker",
  "Best settlement spots",
  "Catan number odds",
  "Setup rules explained",
  "5–6 player expansion boards",
];

function Fold({ light = false, note }: { light?: boolean; note: string }) {
  return (
    <div className={clsx(t.fold, light && t.foldLight)}>
      <span className={clsx(t.foldTag, light && t.foldTagLight)}>{note}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* V1 — Tray                                                           */
/* ------------------------------------------------------------------ */

function VersionOne() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");

  return (
    <div className={t.v1}>
      <div className={t.v1App}>
        <div className={t.v1Stage}>
          <header>
            <h1 className={t.v1Title}>
              A fresh island, <em>before the box is open.</em>
            </h1>
            <p className={t.v1Lede}>
              Shuffle a Catan board on the phone in the middle of the table.
              Read the resource balance before anyone places a settlement.
            </p>
          </header>
          <div className={t.v1BoardWrap}>
            <Board />
          </div>
        </div>

        <aside className={t.v1Tray}>
          <div>
            <div className={t.v1Label}>Pick a set</div>
            <div className={t.v1Fan}>
              <button
                type="button"
                className={clsx(t.v1Card, mode === "classic" && t.v1CardOn)}
                onClick={() => setMode("classic")}
              >
                <div className={t.v1CardTop}>Classic</div>
                <div className={t.v1CardSub}>3–4 players · 19 hexes</div>
              </button>
              <button
                type="button"
                className={clsx(t.v1Card, mode === "expansion" && t.v1CardOn)}
                onClick={() => setMode("expansion")}
              >
                <div className={t.v1CardTop}>Expansion</div>
                <div className={t.v1CardSub}>5–6 players · 30 hexes</div>
              </button>
            </div>
          </div>

          <button type="button" className={t.v1Shuffle}>
            Shuffle the board
          </button>

          <div className={t.v1Divider} />

          <div>
            <div className={t.v1Label}>Resource balance · pips</div>
            <div style={{ marginTop: "0.7rem" }}>
              <ResourceBars
                barHeight={72}
                axisColor="rgba(246, 235, 212, 0.22)"
                valueColor="#f6ebd4"
              />
            </div>
          </div>
        </aside>
      </div>

      <div className={t.v1Scroll} style={{ background: "#102420" }}>
        Scroll for the rules, the odds, and the questions ↓
      </div>

      <Fold note="fold · everything below is crawlable text" />

      <section className={t.v1Seo}>
        <div className={t.v1SeoInner}>
          <div>
            <h2 className={t.v1H2}>What this generator does</h2>
            <p className={t.v1Answer}>{ANSWER}</p>
            <p className={t.v1P}>
              Catan asks for a new board every game. Building one by hand costs
              five minutes, and a careless layout puts every red number in one
              corner. This generator draws a legal board in one tap, then shows
              what the board is worth per resource.
            </p>

            <h3 className={t.v1H3}>Setup rules the generator follows</h3>
            <p className={t.v1P}>
              A board counts as legal when no two red numbers touch and no two
              matching numbers share an edge. Switch either rule off to draw a
              wilder map.
            </p>

            <h3 className={t.v1H3}>Questions</h3>
            {FAQ.map(([question, answer]) => (
              <div className={t.v1FaqItem} key={question}>
                <div className={t.v1FaqQ}>{question}</div>
                <div className={t.v1FaqA}>{answer}</div>
              </div>
            ))}
          </div>

          <aside className={t.v1Aside}>
            <div className={t.v1Label} style={{ color: "#8a7358" }}>
              More for players
            </div>
            <div className={t.v1AsideList}>
              {LINKS.map((link) => (
                <a href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* V2 — Overhead                                                       */
/* ------------------------------------------------------------------ */

function VersionTwo() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");
  const spots = useMemo(() => bestSpots(FIXED_BOARD), []);

  return (
    <div className={clsx(t.v2, barlow.className)}>
      <div className={t.v2App}>
        <div className={t.v2Bar}>
          <span className={t.v2Brand}>CATAN.GG</span>
          <span>Board 4F2A-19 · Classic · 19 hexes</span>
        </div>

        <div className={t.v2Board}>
          <Board spots={spots} />
        </div>

        <div className={t.v2Caption}>
          <h1>Catan board generator</h1>
          <p>Marked corners rank by pip total. Tap a corner to compare.</p>
        </div>

        <aside className={t.v2Panel}>
          <div
            style={{
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,227,205,.55)",
              marginBottom: "0.7rem",
            }}
          >
            Resource balance
          </div>
          <ResourceBars
            barHeight={64}
            axisColor="rgba(239, 227, 205, 0.2)"
            valueColor="#efe3cd"
          />
        </aside>

        <div className={t.v2Hud}>
          <div className={t.v2Seg}>
            <button
              type="button"
              className={clsx(t.v2SegBtn, mode === "classic" && t.v2SegOn)}
              onClick={() => setMode("classic")}
            >
              Classic
            </button>
            <button
              type="button"
              className={clsx(t.v2SegBtn, mode === "expansion" && t.v2SegOn)}
              onClick={() => setMode("expansion")}
            >
              5–6 player
            </button>
          </div>
          <button type="button" className={t.v2Shuffle}>
            Shuffle
          </button>
          <button type="button" className={t.v2Pill}>
            Dice
          </button>
          <button type="button" className={t.v2Pill}>
            Share
          </button>
        </div>
      </div>

      <Fold note="fold · everything below is crawlable text" />

      <section className={clsx(t.v2Seo, inter.className)}>
        <div className={t.v2SeoInner}>
          <div className={t.v2Kicker}>How it works</div>
          <h2 className={t.v2H2}>Three steps to a legal board</h2>

          <div className={t.v2Steps}>
            {STEPS.map(([name, text], index) => (
              <div className={t.v2Step} key={name}>
                <div className={t.v2StepNum}>{index + 1}</div>
                <div className={t.v2StepName}>{name}</div>
                <div className={t.v2StepText}>{text}</div>
              </div>
            ))}
          </div>

          <div className={t.v2Cols}>
            <div>
              <div className={t.v2Kicker}>Number odds</div>
              <table className={t.v2Table}>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Pips</th>
                    <th>Chance per roll</th>
                  </tr>
                </thead>
                <tbody>
                  {ODDS.map(([num, pips]) => (
                    <tr key={num}>
                      <td>{num}</td>
                      <td>{pips}</td>
                      <td>{((pips / 36) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className={t.v2Kicker}>Questions</div>
              {FAQ.map(([question, answer]) => (
                <div className={t.v2FaqItem} key={question}>
                  <div className={t.v2FaqQ}>{question}</div>
                  <div className={t.v2FaqA}>{answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* V3 — Card table                                                     */
/* ------------------------------------------------------------------ */

function VersionThree() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");

  return (
    <div className={clsx(t.v3, cormorant.className)}>
      <div className={t.v3App}>
        <div className={t.v3Top}>
          <div>
            <h1 className={t.v3Title}>Catan board generator</h1>
            <p className={clsx(t.v3Sub, inter.className)}>
              Deal a fresh island for the classic map or the 5–6 player map.
              The felt keeps the board where everyone can see it.
            </p>
          </div>
          <div className={clsx(t.v3Meta, inter.className)}>
            Board 4F2A-19
            <br />
            19 hexes · 18 tokens
          </div>
        </div>

        <div className={t.v3Disc}>
          <Board />
        </div>

        <div className={clsx(t.v3Rail, inter.className)}>
          <button
            type="button"
            className={clsx(t.v3Card, mode === "classic" && t.v3CardOn)}
            onClick={() => setMode("classic")}
          >
            <div className={t.v3CardKicker}>3–4 players</div>
            <div className={t.v3CardName}>Classic</div>
          </button>
          <button
            type="button"
            className={clsx(t.v3Card, mode === "expansion" && t.v3CardOn)}
            onClick={() => setMode("expansion")}
          >
            <div className={t.v3CardKicker}>5–6 players</div>
            <div className={t.v3CardName}>Expansion</div>
          </button>
          <button type="button" className={t.v3Deal}>
            Deal a board
          </button>
        </div>

        <div className={clsx(t.v3Strip, inter.className)}>
          <div>
            <div className={t.v3StripLabel}>Resource balance · pips</div>
            <ResourceBars barHeight={62} axisColor="#d9cbae" valueColor="#2c2418" />
          </div>
          <div className={t.v3Score}>
            <div className={t.v3StripLabel}>Balance score</div>
            <div className={clsx(t.v3ScoreNum, cormorant.className)}>
              72<span>/100</span>
            </div>
          </div>
        </div>
      </div>

      <Fold light note="fold · everything below is crawlable text" />

      <section className={t.v3Seo}>
        <div className={t.v3SeoInner}>
          <h2 className={t.v3H2}>Settlers of Catan, set up in one tap</h2>
          <div className={clsx(t.v3Lead, inter.className)}>
            <p>{ANSWER}</p>
            <p>
              Catan asks for a new board every game. Building one by hand costs
              five minutes, and a careless layout puts every red number in one
              corner of the island. The generator draws a legal board, prints
              the pip count on every token, and shows the resource balance.
            </p>
            <p>
              The tool runs in the browser. It needs no account and no install,
              so it works on the phone that already sits on the table.
            </p>
          </div>

          <div className={clsx(t.v3Split, inter.className)}>
            <div>
              <h3 className={clsx(t.v3H2, cormorant.className)} style={{ fontSize: "1.4rem" }}>
                What the numbers pay
              </h3>
              <table className={t.v3Table}>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Pips</th>
                    <th>Chance</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ODDS.map(([num, pips]) => (
                    <tr key={num}>
                      <td>{num}</td>
                      <td>{pips}</td>
                      <td>{((pips / 36) * 100).toFixed(1)}%</td>
                      <td>
                        <span className={t.v3Bar} style={{ width: pips * 14 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className={clsx(t.v3H2, cormorant.className)} style={{ fontSize: "1.4rem" }}>
                Questions
              </h3>
              {FAQ.map(([question, answer]) => (
                <div className={t.v3FaqItem} key={question}>
                  <div className={t.v3FaqQ}>{question}</div>
                  <div className={t.v3FaqA}>{answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* V4 — Box lid                                                        */
/* ------------------------------------------------------------------ */

function VersionFour() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");

  return (
    <div className={clsx(t.v4, bitter.className)}>
      <div className={t.v4App}>
        <div className={t.v4Band}>
          <div>
            <h1 className={t.v4BandTitle}>Catan Board Generator</h1>
            <div className={t.v4BandSub}>Classic map · 5–6 player expansion</div>
          </div>
          <span className={t.v4BandTag}>Free · no account</span>
        </div>

        <div className={t.v4Body}>
          <div className={t.v4BoardWrap}>
            <Board />
          </div>

          <aside className={t.v4Booklet}>
            <span className={t.v4BookletTab}>Setup</span>

            <div className={t.v4Field}>
              <div className={t.v4FieldLabel}>Board</div>
              <div className={t.v4Seg}>
                <button
                  type="button"
                  className={clsx(t.v4SegBtn, mode === "classic" && t.v4SegOn)}
                  onClick={() => setMode("classic")}
                >
                  Classic
                </button>
                <button
                  type="button"
                  className={clsx(t.v4SegBtn, mode === "expansion" && t.v4SegOn)}
                  onClick={() => setMode("expansion")}
                >
                  5–6 player
                </button>
              </div>
            </div>

            <button type="button" className={t.v4Shuffle}>
              Shuffle the board
            </button>

            <p className={t.v4Note}>
              The generator keeps every 6 and 8 apart, and it keeps matching
              numbers off the same edge.
            </p>

            <div className={t.v4Field} style={{ marginTop: "1.4rem" }}>
              <div className={t.v4FieldLabel}>Resource balance · pips</div>
              <ResourceBars
                barHeight={64}
                axisColor="rgba(42, 33, 24, 0.25)"
                valueColor="#2a2118"
              />
            </div>
          </aside>
        </div>
      </div>

      <Fold light note="fold · everything below is crawlable text" />

      <section className={t.v4Seo}>
        <div className={t.v4SeoInner}>
          <h2 className={t.v4H2} style={{ marginTop: 0 }}>
            How to set up a Catan board
          </h2>
          <p className={t.v4P}>{ANSWER}</p>

          {STEPS.map(([name, text], index) => (
            <div className={t.v4Rule} key={name}>
              <div className={t.v4RuleNum}>{index + 1}</div>
              <div>
                <div className={t.v4RuleTitle}>{name}</div>
                <div className={t.v4RuleText}>{text}</div>
              </div>
            </div>
          ))}

          <h2 className={t.v4H2}>Questions</h2>
          {FAQ.map(([question, answer]) => (
            <div className={t.v4Rule} key={question}>
              <div className={t.v4RuleNum}>Q</div>
              <div>
                <div className={t.v4RuleTitle}>{question}</div>
                <div className={t.v4RuleText}>{answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

const VERSIONS = [
  {
    id: "tray",
    index: "01",
    name: "Tray",
    tag: "Closest to the first pass",
    notes: [
      ["Idea", "The board on felt. A wooden tray holds the controls."],
      [
        "Palette & type",
        "Felt #21453A, tray #3A2718, card #F6EBD4, clay #C0512B. Book Antiqua headings, Euclid body.",
      ],
      [
        "Below the fold",
        "Parchment band. Answer block, setup rules, FAQ, and a link list to the next tool pages.",
      ],
    ],
    render: () => <VersionOne />,
  },
  {
    id: "overhead",
    index: "02",
    name: "Overhead",
    tag: "Board is the hero",
    notes: [
      [
        "Idea",
        "A lamp over a dark table. The board fills the screen and the controls float in a bar.",
      ],
      [
        "Palette & type",
        "Walnut #1A1209, brass #C9A227, cream #EFE3CD. Barlow Condensed caps for the controls.",
      ],
      [
        "Below the fold",
        "Dark walnut band. Three numbered steps, a number odds table, and the FAQ in two columns.",
      ],
    ],
    render: () => <VersionTwo />,
  },
  {
    id: "cardtable",
    index: "03",
    name: "Card table",
    tag: "Light and calm",
    notes: [
      [
        "Idea",
        "Parchment page, a round felt mat under the board, controls dealt as a card rail.",
      ],
      [
        "Palette & type",
        "Paper #F4ECD8, felt #2F6B4F, red #B23A2E. Cormorant Garamond headings, Inter body.",
      ],
      [
        "Below the fold",
        "Cream band. A two column lead with a drop cap, then the odds table and the FAQ side by side.",
      ],
    ],
    render: () => <VersionThree />,
  },
  {
    id: "boxlid",
    index: "04",
    name: "Box lid",
    tag: "Most branded",
    notes: [
      [
        "Idea",
        "The page wears the game box. A burgundy band on top, a rules booklet beside the board.",
      ],
      [
        "Palette & type",
        "Band #7A2E28, kraft #D9C7A3, paper #FBF5E7, gold #C9992B. Book Antiqua and Bitter.",
      ],
      [
        "Below the fold",
        "The booklet continues. Numbered setup steps and numbered questions, so the order carries meaning.",
      ],
    ],
    render: () => <VersionFour />,
  },
];

export default function MockupsTable() {
  return (
    <>
      <Head>
        <title>Table direction · four versions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className={clsx(shell.page, inter.className)}>
        <header className={shell.shellHead}>
          <div className={shell.shellKicker}>
            catan.gg · table direction ·{" "}
            <a href="/mockups" style={{ color: "#d4693f" }}>
              back to the four directions
            </a>
          </div>
          <h1 className={shell.shellTitle}>Four ways to set the table</h1>
          <p className={shell.shellLede}>
            Every version keeps the game night idea you picked: real materials,
            a board you want to look at, and controls that feel like objects.
            They differ in where the board sits, what the controls are made of,
            and how the page reads. Every version also has a content band below
            the fold, so the copy lives on the page instead of in a modal.
          </p>
        </header>

        <nav className={shell.chooser}>
          <div className={shell.chooserInner}>
            <span className={shell.chooserLabel}>Jump to</span>
            {VERSIONS.map((version) => (
              <a
                className={shell.chooserLink}
                href={`#${version.id}`}
                key={version.id}
              >
                {version.index} {version.name}
              </a>
            ))}
          </div>
        </nav>

        {VERSIONS.map((version) => (
          <section className={shell.slot} id={version.id} key={version.id}>
            <div className={shell.slotHead}>
              <span className={shell.slotIndex}>{version.index}</span>
              <h2 className={shell.slotName}>{version.name}</h2>
              <span className={shell.slotTag}>{version.tag}</span>
            </div>

            <div className={shell.slotNotes}>
              {version.notes.map(([label, text]) => (
                <p className={shell.slotNote} key={label}>
                  <b>{label}</b>
                  {text}
                </p>
              ))}
            </div>

            <div className={shell.frame}>{version.render()}</div>
          </section>
        ))}
      </main>
    </>
  );
}
