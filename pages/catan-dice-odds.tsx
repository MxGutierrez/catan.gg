import Link from "next/link";
import s from "@/styles/Article.module.css";
import ArticleLayout from "@/components/ArticleLayout";
import { ARTICLES, SITE } from "@/lib/site";
import { RESOURCE_PROBABILITY } from "@/utils/constants";

const META = ARTICLES[0];

const NUMBERS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
const DICE = [1, 2, 3, 4, 5, 6];

const FAQ: [string, string][] = [
  [
    "Which number is the most likely in Catan?",
    "Ignoring 7, the 6 and the 8 are the most likely. Each comes up on 5 of the 36 dice combinations, which is 13.9% of rolls. The 7 itself is the single most likely total at 6 combinations, but it carries no number token because it moves the robber.",
  ],
  [
    "What are pips in Catan?",
    "Pips are the dots printed under the number on a hex. The count equals how many of the 36 two-dice combinations produce that number, so a 6 shows five dots and a 2 shows one.",
  ],
  [
    "How many pips does a good settlement have?",
    "An inland corner touches three hexes, so its pip total can reach 15. Anything from 10 upward is strong. A corner in the low single digits will starve you unless it holds a resource nobody else has.",
  ],
  [
    "How often does a number come up in a game?",
    "A four player game runs about 60 to 80 rolls. A 5-pip number therefore lands roughly 8 to 11 times, and a 1-pip number lands about 2 times. Short games swing far from those averages.",
  ],
];

/** Combinations of two dice that make each total. */
const ways = (total: number) =>
  DICE.flatMap((a) => DICE.map((b) => a + b)).filter((sum) => sum === total)
    .length;

export default function DiceOdds() {
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
      standfirst="Two dice make 36 combinations. That single fact sets the value of every hex on the board, and it is the whole of Catan probability."
    >
      <p className={s.p}>
        Each Catan hex carries a number token from 2 to 12, and the dots under
        the number are called pips. A pip counts one of the 36 combinations
        that two six-sided dice can roll. A 6 carries five pips, so it pays
        five times more often than a 2, which carries one.
      </p>

      <h2 className={s.h2}>Every number token</h2>
      <table className={s.table}>
        <caption>
          Pips, combinations and roll chance for each Catan number token.
        </caption>
        <thead>
          <tr>
            <th scope="col">Number</th>
            <th scope="col">Pips</th>
            <th scope="col">Ways to roll</th>
            <th scope="col">Chance</th>
            <th scope="col">
              <span className="sr-only">Bar</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {NUMBERS.map((num) => {
            const pips = RESOURCE_PROBABILITY[num];
            const hot = num === 6 || num === 8;
            return (
              <tr key={num}>
                <td className={hot ? s.hot : undefined}>{num}</td>
                <td>{pips}</td>
                <td>{ways(num)}</td>
                <td>{((pips / 36) * 100).toFixed(1)}%</td>
                <td>
                  <span className={s.bar2} style={{ width: pips * 16 }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className={s.p}>
        The 7 is missing from the table because no hex carries it. It is the
        most likely total of all, at six combinations and 16.7% of rolls, and
        it moves the robber instead of paying a resource.
      </p>

      <h2 className={s.h2}>Where the 36 combinations come from</h2>
      <p className={s.p}>
        Each die has six faces, so the pair has 6 × 6 = 36 outcomes. The grid
        below lists the total for every pair. Count how many cells hold a
        number and you have its pip count.
      </p>

      <table className={s.grid}>
        <caption className="sr-only">
          Total for every pair of two six-sided dice.
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span aria-hidden="true">+</span>
            </th>
            {DICE.map((d) => (
              <th scope="col" key={d}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DICE.map((a) => (
            <tr key={a}>
              <th scope="row">{a}</th>
              {DICE.map((b) => {
                const sum = a + b;
                const cls =
                  sum === 7
                    ? s.gridSeven
                    : sum === 6 || sum === 8
                    ? s.gridHot
                    : undefined;
                return (
                  <td className={cls} key={b}>
                    {sum}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className={s.p}>
        The middle diagonal is the 7, shaded grey. The 6 and the 8 sit either
        side of it in clay red. The further a total sits from 7, the fewer
        cells it fills, and the fewer pips it earns.
      </p>

      <h2 className={s.h2}>What the odds mean at the table</h2>
      <p className={s.p}>
        A settlement sits on a corner, and an inland corner touches three
        hexes. Add the pips of those three hexes and you get what the corner
        pays per roll. That sum is the single most useful number when you
        place your first settlement.
      </p>

      <ul className={s.list}>
        <li className={s.li}>
          <strong>15 pips</strong> is the maximum for one corner, and it needs
          three of the 6, 8 and 5 class of hex around it.
        </li>
        <li className={s.li}>
          <strong>10 to 12 pips</strong> is a strong opening corner.
        </li>
        <li className={s.li}>
          <strong>Under 8 pips</strong> only pays if the corner holds a
          resource that the rest of the board is short of, or if it reaches a
          harbour you plan to use.
        </li>
      </ul>

      <div className={s.note}>
        Pips measure how often a corner pays, not how much the payment is
        worth. Ore is scarce on most boards, so a low pip ore hex can beat a
        high pip wool hex once everyone starts building cities.
      </div>

      <h2 className={s.h2}>The long run against one evening</h2>
      <p className={s.p}>
        These percentages describe an infinite number of rolls. One game holds
        roughly 60 to 80. A 5-pip number should land about 9 times in that
        span, but landing 3 times or 16 times is ordinary. Plan around the
        odds, and do not treat a quiet 8 as broken.
      </p>

      <h2 className={s.h2}>Common questions</h2>
      {FAQ.map(([question, answer]) => (
        <div key={question}>
          <h3 className={s.h3}>{question}</h3>
          <p className={s.p}>{answer}</p>
        </div>
      ))}

      <p className={s.p}>
        The generator prints the pip count under every token, and it shows the
        pip total per resource for the whole board.{" "}
        <Link href="/">Draw a board</Link> and read the balance before anyone
        places a settlement.
      </p>

      <Link className={s.cta} href="/">
        Open the board generator
      </Link>
    </ArticleLayout>
  );
}
