import Head from "next/head";
import Board from "@/components/Board";
import { ResourceChart } from "@/components/Board";
import { CLASSIC, Tile, offsetsFor, pipsByResource } from "@/lib/board";

/**
 * The source for /og.png. Open this page, centre it in a viewport larger than
 * 1200 x 630, screenshot it, then crop the screenshot to 1200 x 630.
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
        }}
      >
        <div
          style={{
            width: 1200,
            height: 630,
            display: "grid",
            gridTemplateColumns: "560px 1fr",
            alignItems: "center",
            gap: 48,
            padding: "0 56px",
            background:
              "radial-gradient(70% 90% at 26% 50%, #6b4a28 0%, #35230f 46%, #150e06 100%), #1a1209",
            color: "#efe3cd",
            fontFamily: '"Euclid Circular", ui-sans-serif, system-ui, sans-serif',
            overflow: "hidden",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 48%, #9a6f3c 0%, #6d4a24 58%, rgba(109,74,36,0) 70%)",
              filter: "drop-shadow(0 40px 50px rgba(0,0,0,.75))",
            }}
          >
            <Board board={BOARD} offsets={offsets} mode="normal" />
          </div>

          <div>
            <div
              style={{
                fontSize: 15,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#c9a227",
                marginBottom: 22,
              }}
            >
              catan.gg
            </div>

            <h1
              style={{
                fontFamily: '"Book Antiqua", Georgia, serif',
                fontSize: 62,
                lineHeight: 1.05,
                color: "#efe3cd",
                marginBottom: 20,
              }}
            >
              Catan board
              <br />
              generator
            </h1>

            <p
              style={{
                fontSize: 21,
                lineHeight: 1.5,
                color: "rgba(239,227,205,.72)",
                maxWidth: "24ch",
                marginBottom: 30,
              }}
            >
              A random board in one tap. Classic map and the 5–6 player map.
            </p>

            <div style={{ maxWidth: 300 }}>
              <ResourceChart
                board={BOARD}
                pips={pips}
                barHeight={58}
                axisColor="rgba(239,227,205,.22)"
                valueColor="#efe3cd"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
