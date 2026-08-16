import Head from "next/head";
import Board, { ResourceChart } from "@/components/Board";
import { CLASSIC, Tile, offsetsFor, pipsByResource } from "@/lib/board";

/**
 * The source for /og.png, kept so the card can be redrawn when the design
 * changes. Open this page in a viewport larger than 1200 x 630, screenshot
 * it, then crop the screenshot to 1200 x 630 from the centre.
 *
 * next.config.js keeps this page out of the exported site.
 */
const BOARD: Tile[] = [
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

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export default function OgImage() {
  const offsets = offsetsFor(CLASSIC);
  const pips = pipsByResource(BOARD);

  return (
    <>
      <Head>
        <title>catan.gg social image</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0906",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "calc(100vw * 630 / 1200)",
            zoom: "calc(100vw / 1200)",
            display: "grid",
            gridTemplateColumns: "545px 1fr",
            alignItems: "center",
            gap: 56,
            padding: "0 60px",
            background:
              "radial-gradient(80% 70% at 30% 46%, #5f4326 0%, #3a2917 44%, #1d1409 80%, #140d07 100%), #2b1e12",
            color: "#ede4d3",
            fontFamily:
              '"Euclid Circular", ui-sans-serif, system-ui, sans-serif',
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: GRAIN,
              opacity: 0.34,
              mixBlendMode: "overlay",
            }}
          />

          <div
            style={{
              position: "relative",
              aspectRatio: "1 / 0.866025404",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                filter: "drop-shadow(0 34px 40px rgba(0,0,0,.7))",
              }}
            >
              <Board board={BOARD} offsets={offsets} mode="normal" />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily: '"Book Antiqua", Georgia, serif',
                fontSize: 24,
                marginBottom: 18,
              }}
            >
              catan<span style={{ color: "#c08a3e" }}>.gg</span>
            </div>

            <h1
              style={{
                fontFamily: '"Book Antiqua", Georgia, serif',
                fontSize: 58,
                fontWeight: 400,
                lineHeight: 1.06,
                marginBottom: 18,
              }}
            >
              Catan board
              <br />
              generator
            </h1>

            <p
              style={{
                fontSize: 20,
                lineHeight: 1.5,
                color: "rgba(237,228,211,.62)",
                maxWidth: "26ch",
                marginBottom: 28,
              }}
            >
              A random board for the classic map or the expansion, with the
              setup rules you choose.
            </p>

            <div
              style={{
                width: 300,
                background: "#ede4d3",
                color: "#241c14",
                border: "1px solid #cdbd9f",
                borderRadius: 2,
                padding: "14px 16px 16px",
                transform: "rotate(0.7deg)",
                boxShadow: "0 18px 26px -14px rgba(0,0,0,.75)",
              }}
            >
              <div
                style={{
                  fontFamily: '"Book Antiqua", Georgia, serif',
                  fontSize: 17,
                  borderBottom: "1px solid #cdbd9f",
                  paddingBottom: 7,
                  marginBottom: 11,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Resource balance
                <span style={{ fontSize: 15, color: "#a6412b" }}>93/100</span>
              </div>
              <ResourceChart
                pips={pips}
                barHeight={56}
                axisColor="#cdbd9f"
                valueColor="#241c14"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
