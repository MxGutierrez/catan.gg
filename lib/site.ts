export const SITE = "https://catan.gg";

export type PageMeta = {
  path: string;
  title: string;
  /** Used in the browser tab and in search results. */
  headline: string;
  description: string;
  /** Short label for the links between pages. */
  nav: string;
};

export const HOME: PageMeta = {
  path: "/",
  title: "Catan Board Generator — random Settlers of Catan boards",
  headline: "Catan board generator",
  description:
    "Generate a random Settlers of Catan board in one tap. Classic map and the 5–6 player expansion, with setup rules you can switch on and off.",
  nav: "Board generator",
};

export const ARTICLES: PageMeta[] = [
  {
    path: "/catan-dice-odds",
    title: "Catan dice odds — what every number token pays",
    headline: "Catan dice odds",
    description:
      "Every Catan number token, its pip count and its chance per roll. Includes the full two-dice table and what the odds mean when you place a settlement.",
    nav: "Dice odds",
  },
  {
    path: "/catan-setup-rules",
    title: "Catan setup rules — how to lay out a fair board",
    headline: "Catan setup rules",
    description:
      "The rule the printed manual states, the three house rules groups add, and what each one changes about the board you play on.",
    nav: "Setup rules",
  },
  {
    path: "/catan-5-6-player-expansion",
    title: "Catan 5–6 player expansion — the 30-hex board explained",
    headline: "The 5–6 player expansion board",
    description:
      "What the 5–6 player expansion adds: 30 hexes, 28 number tokens, two deserts, and a wider map. How the layout and the setup rules change.",
    nav: "5–6 player expansion",
  },
];

export const ALL_PAGES = [HOME, ...ARTICLES];
