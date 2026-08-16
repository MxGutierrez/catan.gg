import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Modal from "react-modal";
import { GA_MEASUREMENT_ID } from "@/lib/site";

Modal.setAppElement("#__next");

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // The site has four pages and it moves between them without a reload, so
  // the tag on the first load is the only page view it would ever record.
  useEffect(() => {
    const record = (url: string) =>
      window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });

    router.events.on("routeChangeComplete", record);
    return () => router.events.off("routeChangeComplete", record);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* The board tokens and the headings paint first, so their faces
            load ahead of the rest. */}
        {[
          "Book-Antiqua",
          "Book-Antiqua-Bold",
          "EuclidCircularA-Regular",
        ].map((face) => (
          <link
            key={face}
            rel="preload"
            href={`/fonts/${face}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#c9a227" />
        <meta name="msapplication-TileColor" content="#1a1209" />
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
