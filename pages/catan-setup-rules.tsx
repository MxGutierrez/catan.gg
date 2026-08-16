import Link from "next/link";
import s from "@/styles/Article.module.css";
import ArticleLayout from "@/components/ArticleLayout";
import { ARTICLES, SITE } from "@/lib/site";

const META = ARTICLES[1];

const RULES: [string, string, string, string][] = [
  [
    "Keep 6 and 8 apart",
    "On by default",
    "The printed manual states it.",
    "The 6 and the 8 pay five pips each, more than any other token. A corner that touches both decides the game in the first ten minutes. Keeping them off the same edge spreads the strongest hexes across the island.",
  ],
  [
    "Keep 2 and 12 apart",
    "Off by default",
    "A house rule.",
    "This is the mirror of the first rule. The 2 and the 12 pay one pip each, so a corner that touches both is close to dead. Separating them means fewer corners nobody wants, which keeps more of the map worth playing.",
  ],
  [
    "Keep matching numbers apart",
    "On by default",
    "A house rule.",
    "Two hexes with the same number on one corner pay twice on a single roll. That is swingy: the owner floods on a hit and starves in between. The rule spreads each number out so no roll is worth double to one player.",
  ],
  [
    "Keep matching resources apart",
    "Off by default",
    "A house rule.",
    "A random draw often clumps four wool hexes into one corner of the island. This rule breaks the blocks up, so every part of the map offers a mix. It is the strictest rule of the four, and it changes the look of the board the most.",
  ],
];

const FAQ: [string, string][] = [
  [
    "What is the official Catan setup rule?",
    "The printed manual asks you to place the number tokens so that no 6 touches another 6 or an 8, and no 8 touches another 8 or a 6. That is the only placement constraint the rules state. Everything else is a house rule.",
  ],
  [
    "Can two red numbers be next to each other in Catan?",
    "Not under the printed rule. The 6 and the 8 are the red numbers, and the manual keeps them off the same edge. Groups that want a wilder board sometimes drop the rule on purpose.",
  ],
  [
    "Should the desert be in the middle?",
    "The beginner layout puts it in the middle, and the random setup does not. A central desert is convenient, because the robber starts far from the outer hexes. A random desert placement is the normal choice once a group knows the game.",
  ],
  [
    "Do the rules change for the 5–6 player expansion?",
    "No. The same rules apply, just to more hexes. The larger map has more shared edges, so a strict rule set takes more work to satisfy.",
  ],
];

export default function SetupRules() {
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
      standfirst="One rule comes from the printed manual. The other three are house rules that groups add because a purely random board is often unfair to somebody."
    >
      <p className={s.p}>
        A Catan board is legal the moment the pieces are on the table. It is
        not always fair. Four constraints decide how even the map plays, and
        the generator applies whichever ones you tick.
      </p>

      <h2 className={s.h2}>The four rules</h2>
      <table className={s.table} style={{ maxWidth: "100%" }}>
        <caption>What each rule does and whether it starts on.</caption>
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Default</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {RULES.map(([name, def, source]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{def}</td>
              <td>{source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {RULES.map(([name, def, , text]) => (
        <div key={name}>
          <h3 className={s.h3}>
            {name} <span style={{ fontWeight: 400, opacity: 0.6 }}>· {def}</span>
          </h3>
          <p className={s.p}>{text}</p>
        </div>
      ))}

      <h2 className={s.h2}>Why a random draw is not enough</h2>
      <p className={s.p}>
        Most generators shuffle the tiles and then check the result. That
        works while the rules are loose. It stops working when you ask for
        matching resources to stay apart: in a test of 100 attempts at 20,000
        shuffles each, a plain shuffle satisfied that rule 18 times and gave
        up 82 times.
      </p>
      <p className={s.p}>
        This generator places the pieces instead. It fills the hardest
        position first, and it steps back whenever a position runs out of
        pieces. Every rule combination then lands in well under a millisecond,
        including the strict one.
      </p>

      <div className={s.note}>
        A board that satisfies every rule is not the same as a balanced board.
        The rules control where pieces sit next to each other. They do not
        control how much of each resource the map pays overall, which is what
        the balance score on the generator measures.
      </div>

      <h2 className={s.h2}>What to tick, and when</h2>
      <ul className={s.list}>
        <li className={s.li}>
          <strong>New group:</strong> leave the defaults. The board matches
          the printed rule and avoids the worst clumps.
        </li>
        <li className={s.li}>
          <strong>Tournament feel:</strong> tick all four. The map comes out
          even and no corner runs away with the game.
        </li>
        <li className={s.li}>
          <strong>Chaos:</strong> untick everything. Red numbers may sit
          together, and one player may draw a very rich corner.
        </li>
      </ul>

      <p className={s.p}>
        The rules sit on the printed slip beside the board.{" "}
        <Link href="/">Open the generator</Link> and tick the set you want, or
        read what each number token pays in{" "}
        <Link href="/catan-dice-odds">Catan dice odds</Link>.
      </p>

      <h2 className={s.h2}>Common questions</h2>
      {FAQ.map(([question, answer]) => (
        <div key={question}>
          <h3 className={s.h3}>{question}</h3>
          <p className={s.p}>{answer}</p>
        </div>
      ))}

      <Link className={s.cta} href="/">
        Open the board generator
      </Link>
    </ArticleLayout>
  );
}
