import Head from "next/head";
import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  Archivo,
  Fredoka,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  Newsreader,
  Nunito,
} from "@next/font/google";
import s from "@/styles/Mockups.module.css";
import {
  Board,
  FIXED_BOARD,
  RESOURCE_COLOR,
  RESOURCE_LABEL,
  RESOURCE_ORDER,
  ResourceBars,
  bestSpots,
  pipsByResource,
} from "@/components/mock/MockBoard";

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "700"] });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600"] });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500"] });
const inter = Inter({ subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/* Direction A — Survey                                                */
/* ------------------------------------------------------------------ */

function DirectionA() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");
  const [rules, setRules] = useState({ hot: true, same: true, ports: false });
  const spots = useMemo(() => bestSpots(FIXED_BOARD), []);
  const pips = useMemo(() => pipsByResource(FIXED_BOARD), []);
  const maxPips = Math.max(...Object.values(pips));

  return (
    <div className={clsx(s.a, plexSans.className)}>
      <aside className={s.aRail}>
        <div className={s.aBrand} style={{ fontFamily: plexMono.style.fontFamily }}>
          <span className={s.aBrandMark} />
          catan.gg
        </div>

        <div>
          <h1 className={s.aTitle} style={{ fontFamily: archivo.style.fontFamily }}>
            Catan board
            <br />
            generator
          </h1>
          <p className={s.aLede}>
            Draw a legal board, then read what it is worth before anyone places
            a settlement.
          </p>
        </div>

        <div>
          <div
            className={s.aFieldLabel}
            style={{ fontFamily: plexMono.style.fontFamily }}
          >
            <span>Board</span>
            <span>{mode === "classic" ? "19 hex" : "30 hex"}</span>
          </div>
          <div className={s.aSeg}>
            <button
              type="button"
              className={clsx(s.aSegBtn, mode === "classic" && s.aSegOn)}
              onClick={() => setMode("classic")}
            >
              Classic
            </button>
            <button
              type="button"
              className={clsx(s.aSegBtn, mode === "expansion" && s.aSegOn)}
              onClick={() => setMode("expansion")}
            >
              5–6 player
            </button>
          </div>
        </div>

        <div>
          <div
            className={s.aFieldLabel}
            style={{ fontFamily: plexMono.style.fontFamily }}
          >
            <span>Constraints</span>
            <span>3</span>
          </div>
          <div className={s.aChecks}>
            {[
              ["hot", "Keep 6 and 8 apart"],
              ["same", "No matching numbers touching"],
              ["ports", "Shuffle the harbours too"],
            ].map(([key, label]) => (
              <label className={s.aCheck} key={key}>
                <span
                  className={clsx(
                    s.aCheckBox,
                    rules[key as keyof typeof rules] && s.aCheckOn
                  )}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  checked={rules[key as keyof typeof rules]}
                  onChange={() =>
                    setRules((r) => ({
                      ...r,
                      [key]: !r[key as keyof typeof rules],
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={s.aGenerate}
          style={{ fontFamily: plexMono.style.fontFamily }}
        >
          <span>Draw a board</span>
          <span>↻</span>
        </button>
      </aside>

      <div className={s.aStage}>
        <div className={s.aStageInner}>
          <div className={s.aPlot}>
            <span
              className={clsx(s.aPlotTick, s.aPlotTickTop)}
              style={{ fontFamily: plexMono.style.fontFamily }}
            >
              BOARD 4F2A-19
            </span>
            <span
              className={clsx(s.aPlotTick, s.aPlotTickRight)}
              style={{ fontFamily: plexMono.style.fontFamily }}
            >
              CLASSIC / 19 HEX
            </span>
            <span
              className={clsx(s.aPlotTick, s.aPlotTickBottom)}
              style={{ fontFamily: plexMono.style.fontFamily }}
            >
              ● MARKED SPOTS RANK BY PIP TOTAL
            </span>
            <Board spots={spots} />
          </div>
        </div>
      </div>

      <aside className={s.aReadout}>
        <div className={s.aScore}>
          <div
            className={s.aScoreNum}
            style={{ fontFamily: archivo.style.fontFamily }}
          >
            72<span>/100</span>
          </div>
          <div
            className={s.aScoreCap}
            style={{ fontFamily: plexMono.style.fontFamily }}
          >
            Balance score
          </div>
        </div>

        <div>
          <div
            className={s.aFieldLabel}
            style={{ fontFamily: plexMono.style.fontFamily }}
          >
            <span>Pips per resource</span>
            <span>Σ 60</span>
          </div>
          {RESOURCE_ORDER.map((resource) => (
            <div
              className={s.aBar}
              key={resource}
              style={{ fontFamily: plexMono.style.fontFamily }}
            >
              <picture>
                <source
                  srcSet={`/images/${resource}-resource.webp`}
                  type="image/webp"
                />
                <img
                  className={s.aBarName}
                  src={`/images/${resource}-resource.png`}
                  alt={RESOURCE_LABEL[resource]}
                />
              </picture>
              <span className={s.aBarTrack}>
                <span
                  className={s.aBarFill}
                  style={{
                    width: `${(pips[resource] / maxPips) * 100}%`,
                    background: RESOURCE_COLOR[resource],
                  }}
                />
              </span>
              <span className={s.aBarVal}>{pips[resource]}</span>
            </div>
          ))}
        </div>

        <div>
          <div
            className={s.aFieldLabel}
            style={{ fontFamily: plexMono.style.fontFamily }}
          >
            <span>Best spots</span>
            <span>Pips</span>
          </div>
          <table className={s.aTable} style={{ fontFamily: plexMono.style.fontFamily }}>
            <tbody>
              {spots.map((spot, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {spot.resources
                      .map((r) => RESOURCE_LABEL[r] ?? r)
                      .join(" · ")}
                  </td>
                  <td>{spot.pips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Direction B — Table                                                 */
/* ------------------------------------------------------------------ */

const DICE_FACES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DICE_WAYS: { [key: number]: number } = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
};

function DirectionB() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");
  const [rolls, setRolls] = useState<{ [key: number]: number }>({
    5: 3,
    6: 4,
    8: 2,
    9: 3,
    10: 1,
    4: 2,
    11: 1,
    7: 5,
  });

  const total = Object.values(rolls).reduce((sum, n) => sum + n, 0);
  const peak = Math.max(4, ...Object.values(rolls));

  return (
    <div className={s.b}>
      <div className={s.bStage}>
        <header className={s.bHeadline}>
          <h1 className={s.bTitle}>
            A fresh island,
            <br />
            <em>before the box is open.</em>
          </h1>
          <p className={s.bLede}>
            Shuffle a Catan board on the phone in the middle of the table, then
            keep the dice count honest while you play.
          </p>
        </header>

        <div className={s.bBoardWrap}>
          <Board />
        </div>
      </div>

      <aside className={s.bTray}>
        <div>
          <div className={s.bTrayLabel}>Pick a set</div>
          <div className={s.bFan} style={{ marginTop: "0.6rem" }}>
            <button
              type="button"
              className={clsx(s.bCard, mode === "classic" && s.bCardOn)}
              onClick={() => setMode("classic")}
            >
              <div className={s.bCardTop}>Classic</div>
              <div className={s.bCardSub}>3–4 players · 19 hexes</div>
            </button>
            <button
              type="button"
              className={clsx(s.bCard, mode === "expansion" && s.bCardOn)}
              onClick={() => setMode("expansion")}
            >
              <div className={s.bCardTop}>Expansion</div>
              <div className={s.bCardSub}>5–6 players · 30 hexes</div>
            </button>
          </div>
        </div>

        <button type="button" className={s.bShuffle}>
          Shuffle the board
        </button>

        <div className={s.bDivider} />

        <div className={s.bTracker}>
          <div className={s.bTrayLabel}>Resource balance · pips per resource</div>
          <ResourceBars
            barHeight={66}
            axisColor="rgba(246, 235, 212, 0.22)"
            valueColor="#f6ebd4"
          />
        </div>

        <div className={s.bDivider} />

        <div className={s.bTracker}>
          <div className={s.bTrayLabel}>Dice tracker · tap what you rolled</div>

          <div className={s.bChart}>
            {DICE_FACES.map((face) => (
              <div className={s.bChartCol} key={face}>
                <span
                  className={s.bChartExpected}
                  style={{
                    bottom: `${((DICE_WAYS[face] / 36) * total * 100) / peak}%`,
                  }}
                />
                <span
                  className={s.bChartFill}
                  style={{ height: `${((rolls[face] ?? 0) / peak) * 100}%` }}
                />
              </div>
            ))}
          </div>

          <div className={s.bDiceRow}>
            {DICE_FACES.map((face) => (
              <button
                type="button"
                key={face}
                className={s.bDice}
                onClick={() =>
                  setRolls((r) => ({ ...r, [face]: (r[face] ?? 0) + 1 }))
                }
              >
                {face}
              </button>
            ))}
          </div>

          <div className={s.bTrackerFoot}>
            <span>{total} rolls · dashed line is expected</span>
            <button
              type="button"
              className={s.bReset}
              onClick={() => setRolls({})}
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Direction C — Harbor                                                */
/* ------------------------------------------------------------------ */

function DirectionC() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");
  const [turn, setTurn] = useState(1);

  return (
    <div className={clsx(s.c, nunito.className)}>
      <div className={s.cTop}>
        <nav className={s.cNav}>
          <span className={s.cLogo}>
            <span className={s.cLogoMark}>⬡</span> catan.gg
          </span>
          <span className={s.cNavLinks}>
            <span>Generator</span>
            <span>Dice tracker</span>
            <span>Rules</span>
          </span>
        </nav>

        <h1
          className={s.cHeadline}
          style={{ fontFamily: fredoka.style.fontFamily }}
        >
          Roll a new island in one tap.
        </h1>
        <p className={s.cSub}>
          A Catan board generator built for the phone you already put on the
          table. Big buttons, no setup, a code to share with the group.
        </p>

        <svg className={s.cWave} viewBox="0 0 1440 68" preserveAspectRatio="none">
          <path
            d="M0 34c120-28 240-28 360 0s240 28 360 0 240-28 360 0 240 28 360 0v34H0z"
            fill="#e3f2fb"
          />
        </svg>
      </div>

      <div className={s.cBody}>
        <div className={s.cCard}>
          <div className={s.cSeg}>
            <button
              type="button"
              className={clsx(s.cSegBtn, mode === "classic" && s.cSegOn)}
              onClick={() => setMode("classic")}
            >
              Classic
            </button>
            <button
              type="button"
              className={clsx(s.cSegBtn, mode === "expansion" && s.cSegOn)}
              onClick={() => setMode("expansion")}
            >
              5–6 players
            </button>
          </div>

          <div className={s.cBoardWrap}>
            <Board />
          </div>

          <div className={s.cChart}>
            <div className={s.cCardLabel}>Resource balance</div>
            <ResourceBars showNames axisColor="#cfe4f0" valueColor="#08304b" />
          </div>
        </div>

        <div className={s.cRail}>
          <button
            type="button"
            className={s.cBig}
            style={{ fontFamily: fredoka.style.fontFamily }}
          >
            Shuffle
          </button>

          <div className={s.cCodeCard}>
            <div className={s.cCardLabel}>Board code</div>
            <div className={s.cCode}>
              <span>4F2A-19</span>
              <button type="button" className={s.cCopy}>
                Copy link
              </button>
            </div>
            <p className={s.cHint}>
              Send the code to the group. Everyone opens the same board on their
              own phone.
            </p>
          </div>

          <div className={s.cTimer}>
            <div className={s.cCardLabel} style={{ color: "rgba(255,255,255,.6)" }}>
              Turn timer
            </div>
            <div className={s.cTimerRow}>
              <span className={s.cTimerNum}>0:45</span>
              <button
                type="button"
                className={s.cTimerBtn}
                onClick={() => setTurn((t) => (t % 4) + 1)}
              >
                Next player
              </button>
            </div>
            <div className={s.cPlayers}>
              {[1, 2, 3, 4].map((player) => (
                <span
                  key={player}
                  className={clsx(s.cPlayer, turn === player && s.cPlayerOn)}
                >
                  P{player}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={s.cPhoneStrip}>
        <div className={s.cPhone}>
          <div className={s.cPhoneScreen}>
            <div className={s.cPhoneBar}>
              <span>catan.gg</span>
              <span className={s.cPhoneChip}>4F2A-19</span>
            </div>
            <Board />
            <button
              type="button"
              className={s.cPhoneCta}
              style={{ fontFamily: fredoka.style.fontFamily }}
            >
              Shuffle
            </button>
          </div>
        </div>

        <div className={s.cPhoneNote}>
          <h3 style={{ fontFamily: fredoka.style.fontFamily }}>
            The phone is the real screen
          </h3>
          <p>
            Most players open the generator on a phone that sits in the middle
            of the table. The board fills the width, the shuffle button stays
            under the thumb, and the board code sits in the top bar so anyone
            can copy it.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Direction D — Almanac                                               */
/* ------------------------------------------------------------------ */

const ODDS = [
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

const FAQ = [
  [
    "How does the generator place the numbers?",
    "The generator shuffles the 18 number tokens and the 18 resource hexes, then checks the layout against the rules you switch on. If a check fails, it draws again.",
  ],
  [
    "Can 6 and 8 touch on a generated board?",
    "Only if you allow it. The default board keeps every 6 and 8 apart, which matches the setup rule in the printed manual for a balanced game.",
  ],
  [
    "Does it support the 5–6 player expansion?",
    "Yes. The expansion board uses 30 hexes and 28 number tokens, and the generator applies the same constraints to the larger map.",
  ],
  [
    "Do I need to install anything?",
    "No. The generator runs in the browser on a phone, a tablet, or a laptop, and it works with no account.",
  ],
];

function DirectionD() {
  const [mode, setMode] = useState<"classic" | "expansion">("classic");
  const [rules, setRules] = useState({ hot: true, same: true });

  return (
    <div
      className={clsx(s.d, inter.className)}
      style={{ ["--font-display" as any]: newsreader.style.fontFamily }}
    >
      <div className={s.dBar}>
        <span className={s.dBarBrand}>catan.gg</span>
        <span className={s.dBarLinks}>
          <span>Generator</span>
          <span>Number odds</span>
          <span>Setup rules</span>
          <span>Dice tracker</span>
        </span>
      </div>

      <div className={s.dGrid}>
        <div>
          <div className={s.dSticky}>
            <div className={s.dToolCard}>
            <div className={s.dSeg}>
              <button
                type="button"
                className={clsx(s.dSegBtn, mode === "classic" && s.dSegOn)}
                onClick={() => setMode("classic")}
              >
                Classic
              </button>
              <button
                type="button"
                className={clsx(s.dSegBtn, mode === "expansion" && s.dSegOn)}
                onClick={() => setMode("expansion")}
              >
                5–6 players
              </button>
            </div>

            <Board />

            <button type="button" className={s.dShuffle}>
              Generate a board
            </button>

            <div className={s.dRules}>
              {[
                ["hot", "Keep 6 and 8 apart"],
                ["same", "No matching numbers touching"],
              ].map(([key, label]) => (
                <button
                  type="button"
                  className={s.dRule}
                  key={key}
                  onClick={() =>
                    setRules((r) => ({
                      ...r,
                      [key]: !r[key as keyof typeof rules],
                    }))
                  }
                >
                  <span
                    className={clsx(
                      s.dSwitch,
                      rules[key as keyof typeof rules] && s.dSwitchOn
                    )}
                  />
                  {label}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={s.dEyebrow}>Free · no account · works offline</div>
          <h1 className={s.dH1}>Catan board generator</h1>

          <div className={s.dAnswer}>
            <b>In short:</b> catan.gg draws a random Settlers of Catan board for
            the classic 19-hex map or the 30-hex 5–6 player expansion. It keeps
            6 and 8 apart, prints the pip count on every token, and needs one
            tap.
          </div>

          <div className={s.dProse}>
            <h2>Resource balance on this board</h2>
            <p>
              Each bar is the pip total for one resource. A tall bar means the
              resource comes out often, so a settlement next to it pays more
              over a full game.
            </p>
            <div className={s.dChart}>
              <ResourceBars showNames axisColor="#ddddd4" valueColor="#16191c" />
            </div>

            <h2>What the number tokens are worth</h2>
            <p>
              Two dice give 36 combinations. The pips under each number show how
              many of those combinations produce it, so a 6 or an 8 pays five
              times more often than a 2 or a 12.
            </p>

            <table className={s.dOdds}>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Pips</th>
                  <th>Chance per roll</th>
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
                      <span
                        className={s.dOddsBar}
                        style={{ width: `${pips * 16}px` }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>Setup rules the generator follows</h2>
            <p>
              A board counts as legal when no two red numbers touch and no two
              matching numbers share an edge. Switch either rule off to draw a
              wilder map.
            </p>

            <h2>Questions</h2>
            <div className={s.dFaq}>
              {FAQ.map(([question, answer]) => (
                <div className={s.dFaqItem} key={question}>
                  <div className={s.dFaqQ}>{question}</div>
                  <div className={s.dFaqA}>{answer}</div>
                </div>
              ))}
            </div>

            <div className={s.dChips}>
              <span className={s.dChip}>FAQPage schema</span>
              <span className={s.dChip}>HowTo schema</span>
              <span className={s.dChip}>SoftwareApplication schema</span>
              <span className={s.dChip}>Answer-first copy</span>
              <span className={s.dChip}>Crawlable text, no modal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

const DIRECTIONS = [
  {
    id: "survey",
    index: "01",
    name: "Survey",
    tag: "Analytical",
    notes: [
      ["Idea", "The board is data. The page reads it back to you."],
      [
        "Palette & type",
        "Paper #EEF1F4, ink #0E1B2A, survey orange #E2571F. Archivo for the title, IBM Plex Mono for every number.",
      ],
      [
        "Extra tool",
        "Best settlement spots. The page ranks the corners by pip total and marks them on the board.",
      ],
    ],
    render: () => <DirectionA />,
  },
  {
    id: "table",
    index: "02",
    name: "Table",
    tag: "Game night",
    notes: [
      ["Idea", "The screen becomes the table. Felt, wood tray, cards you pick."],
      [
        "Palette & type",
        "Felt #21453A, card #F6EBD4, clay #C0512B, gold #E3A82B. Book Antiqua for headings, which already ships in the repo.",
      ],
      [
        "Extra tool",
        "Dice tracker. Tap each roll and compare the real count against the expected curve.",
      ],
    ],
    render: () => <DirectionB />,
  },
  {
    id: "harbor",
    index: "03",
    name: "Harbor",
    tag: "Mobile first",
    notes: [
      ["Idea", "One thumb, one tap, big targets. The board fills the phone."],
      [
        "Palette & type",
        "Sea #0E6BA8, deep #08304B, coral #FF6B4A, sun #FFC542. Fredoka for the headline, Nunito for the body.",
      ],
      [
        "Extra tool",
        "Board code and turn timer. Share one code so the whole group sees the same map.",
      ],
    ],
    render: () => <DirectionC />,
  },
  {
    id: "almanac",
    index: "04",
    name: "Almanac",
    tag: "Best for SEO",
    notes: [
      [
        "Idea",
        "The tool stays sticky on the left. The answers live on the page, not in a modal.",
      ],
      [
        "Palette & type",
        "Paper #FBFAF7, ink #16191C, forest #2E5E4E. Newsreader for headings, Inter for the body.",
      ],
      [
        "Extra tool",
        "Number odds table and setup rule switches, both readable by a crawler and by a model.",
      ],
    ],
    render: () => <DirectionD />,
  },
];

const TOOLKIT = [
  [
    "Best settlement spots",
    "High",
    "Rank every corner by pip total and resource mix. This is the question players ask first.",
  ],
  [
    "Dice roll tracker",
    "High",
    "Tap each roll during the game. Shows the real distribution against the expected curve.",
  ],
  [
    "Shareable board code",
    "High",
    "A short code in the URL. Everyone at the table opens the same board on their own phone.",
  ],
  [
    "Setup rule switches",
    "Medium",
    "Let players allow or block 6 and 8 touching, matching numbers, and matching resources.",
  ],
  [
    "Balance score",
    "Medium",
    "One number for how even the board is. Good for a rematch, good for a screenshot.",
  ],
  [
    "Harbour shuffle",
    "Medium",
    "Randomise the nine harbours as well as the hexes. Nothing else online does it well.",
  ],
  [
    "Printable board sheet",
    "Low",
    "A clean sheet to print or save when the group sets up the physical board.",
  ],
  [
    "Turn timer",
    "Low",
    "Keeps a slow group moving. Small feature, strong word of mouth.",
  ],
];

export default function Mockups() {
  return (
    <>
      <Head>
        <title>Design directions · catan.gg</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className={clsx(s.page, inter.className)}>
        <header className={s.shellHead}>
          <div className={s.shellKicker}>
            catan.gg · design review ·{" "}
            <a href="/mockups-table" style={{ color: "#d4693f" }}>
              four versions of the table direction
            </a>
          </div>
          <h1 className={s.shellTitle}>Four directions for the rebuild</h1>
          <p className={s.shellLede}>
            Every direction below is a working screen, not a picture. The board
            art and the resource balance chart stay the same in all four, so the
            comparison is about layout, palette, type, and the extra tool each
            direction adds. Pick one, or pick parts of several.
          </p>
        </header>

        <dl className={s.auditGrid}>
          {[
            [
              "The copy is hidden",
              "All the text sits inside a modal. A crawler and a model see an empty page.",
            ],
            [
              "One page, one keyword",
              "The site targets a single term. Every related search goes to a competitor.",
            ],
            [
              "No structured data",
              "No FAQ, HowTo, or application markup, so no rich result and no easy citation.",
            ],
            [
              "The tool stops early",
              "It shuffles and stops. Players still want odds, spots, and a way to share.",
            ],
          ].map(([term, detail]) => (
            <div className={s.auditCell} key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>

        <nav className={s.chooser}>
          <div className={s.chooserInner}>
            <span className={s.chooserLabel}>Jump to</span>
            {DIRECTIONS.map((direction) => (
              <a
                className={s.chooserLink}
                href={`#${direction.id}`}
                key={direction.id}
              >
                {direction.index} {direction.name}
              </a>
            ))}
            <a className={s.chooserLink} href="#toolkit">
              Toolkit
            </a>
          </div>
        </nav>

        {DIRECTIONS.map((direction) => (
          <section className={s.slot} id={direction.id} key={direction.id}>
            <div className={s.slotHead}>
              <span className={s.slotIndex}>{direction.index}</span>
              <h2 className={s.slotName}>{direction.name}</h2>
              <span className={s.slotTag}>{direction.tag}</span>
            </div>

            <div className={s.slotNotes}>
              {direction.notes.map(([label, text]) => (
                <p className={s.slotNote} key={label}>
                  <b>{label}</b>
                  {text}
                </p>
              ))}
            </div>

            <div className={s.frame}>{direction.render()}</div>
          </section>
        ))}

        <section className={s.toolkit} id="toolkit">
          <div className={s.slotHead}>
            <span className={s.slotIndex}>05</span>
            <h2 className={s.slotName}>Toolkit shortlist</h2>
          </div>
          <p className={s.slotNote} style={{ maxWidth: "60ch" }}>
            These are the tools worth building next. Each one also earns its own
            page and its own search term, so the feature work and the SEO work
            are the same work.
          </p>

          <div className={s.toolGrid}>
            {TOOLKIT.map(([name, priority, text]) => (
              <div className={s.toolCell} key={name}>
                <div className={s.toolName}>
                  {name}
                  <span
                    className={clsx(
                      s.toolBadge,
                      priority === "High" && s.toolBadgeHot
                    )}
                  >
                    {priority}
                  </span>
                </div>
                <p className={s.toolText}>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
