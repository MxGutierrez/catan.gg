import Head from "next/head";
import Link from "next/link";
import s from "@/styles/Article.module.css";
import { ALL_PAGES, PageMeta, SITE } from "@/lib/site";

interface Props {
  meta: PageMeta;
  standfirst: string;
  /** Extra schema.org nodes for this page, on top of the article graph. */
  schema?: object[];
  children: React.ReactNode;
}

export default function ArticleLayout({
  meta,
  standfirst,
  schema = [],
  children,
}: Props) {
  const url = `${SITE}${meta.path}`;
  const others = ALL_PAGES.filter((page) => page.path !== meta.path);

  const graph = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: meta.headline,
      description: meta.description,
      url,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: "catan.gg", url: `${SITE}/` },
      about: { "@type": "Game", name: "CATAN" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#crumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Catan board generator",
          item: `${SITE}/`,
        },
        { "@type": "ListItem", position: 2, name: meta.headline, item: url },
      ],
    },
    ...schema,
  ];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={url} />
        <meta name="theme-color" content="#2b1e12" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="catan.gg" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${SITE}/og.png`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": graph,
            }),
          }}
        />
      </Head>

      <div className={s.page}>
        <div className={s.bar}>
          <div className={s.barInner}>
            <Link className={s.brand} href="/">
              catan<span>.gg</span>
            </Link>
            <Link className={s.barLink} href="/">
              Open the board generator
            </Link>
          </div>
        </div>

        <main className={s.main}>
          <nav className={s.crumbs} aria-label="Breadcrumb">
            <Link href="/">Catan board generator</Link> · {meta.headline}
          </nav>

          <h1 className={s.h1}>{meta.headline}</h1>
          <p className={s.standfirst}>{standfirst}</p>

          {children}

          <section className={s.next}>
            <h2 className={s.h2} style={{ marginTop: 0 }}>
              Read next
            </h2>
            <div className={s.nextGrid}>
              {others.map((page) => (
                <Link className={s.nextCard} href={page.path} key={page.path}>
                  <div className={s.nextName}>{page.headline}</div>
                  <div className={s.nextText}>{page.description}</div>
                </Link>
              ))}
            </div>
          </section>

          <footer className={s.footer}>
            catan.gg is an independent fan tool. CATAN is a trademark of its
            owner.
          </footer>
        </main>
      </div>
    </>
  );
}
