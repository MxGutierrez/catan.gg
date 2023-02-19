import { Inter } from "@next/font/google";
import { useEffect, useMemo, useState } from "react";
import Tile from "@/components/Tile";
import ResourceGraph from "@/components/ResourceGraph";
import Button from "@/components/Button";
import { BiShuffle } from "react-icons/bi";
import Footer from "@/components/Footer";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

const resourceTypes = ["ore", "sheep", "brick", "wood", "wheat", "desert"];

const RESOURCES = [
  "ore",
  "ore",
  "ore",
  "brick",
  "brick",
  "brick",
  "sheep",
  "sheep",
  "sheep",
  "sheep",
  "wood",
  "wood",
  "wood",
  "wood",
  "wheat",
  "wheat",
  "wheat",
  "wheat",
];
const NUMS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const expansionResources = [
  "ore",
  "ore",
  "ore",
  "ore",
  "ore",
  "brick",
  "brick",
  "brick",
  "brick",
  "brick",
  "sheep",
  "sheep",
  "sheep",
  "sheep",
  "sheep",
  "sheep",
  "wood",
  "wood",
  "wood",
  "wood",
  "wood",
  "wood",
  "wheat",
  "wheat",
  "wheat",
  "wheat",
  "wheat",
  "wheat",
];
const expansionNums = [
  2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11,
  11, 11, 12, 12,
];

function shuffle(array: any[]) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default function Home() {
  const [board, setBoard] = useState<Board>([]);
  const [mode, setMode] = useState<Mode>("normal");
  const [offsets, setOffsets] = useState<any[]>([]);

  const size = useMemo(() => {
    return mode === "normal" ? 17.5 : 16;
  }, [mode]);

  const generateBoard = () => {
    const board: Tile[] = [];
    const resources = mode === "normal" ? RESOURCES : expansionResources;
    const nums = mode === "normal" ? NUMS : expansionNums;

    const shuffledResources = shuffle(resources);
    const shuffledNums = shuffle(nums);

    shuffledResources.forEach((resource, index) => {
      board.push({
        resource,
        num: shuffledNums[index],
      });
    });

    board.push({
      resource: "desert",
      num: 0,
    });

    if (mode === "expanded") {
      board.push({
        resource: "desert",
        num: 0,
      });
    }

    setBoard(shuffle(board));
  };

  const generateOffsets = (size: number, mode: Mode) => {
    let r = 0.866025404 * size;
    const offsets = [];

    const board = {
      tiles_per_row: [3, 4, 5, 4, 3],
      row_step: 0.73 * size,
      center_row: Math.floor([3, 4, 5, 4, 3].length / 2),
      cell_step: 0.99 * r,
    };

    if (mode === "expanded") {
      board.tiles_per_row = [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1];
      board.center_row = Math.floor(board.tiles_per_row.length / 2);
      board.cell_step = 1.51 * size * 0.99;
      board.row_step = r / 1.99;
    }

    for (let i = 0; i < board.tiles_per_row.length; i++) {
      const rowLevel = i - board.center_row;
      const y = 50 + rowLevel * board.row_step;
      const xIsEvenShift = ((i % 2) * board.cell_step) / 2;
      // const xIsEvenShift = 0;
      const xFirstCellShift =
        Math.floor(board.tiles_per_row[i] / 2) * board.cell_step;
      // const xFirstCellShift = 0;

      for (let e = 0; e < board.tiles_per_row[i]; e++) {
        offsets.push({
          left: 50 - xFirstCellShift + xIsEvenShift + e * board.cell_step,
          top: y,
        });
      }
    }
    return offsets;
  };

  useEffect(() => {
    generateBoard();
  }, [mode]);

  useEffect(() => {
    setOffsets(generateOffsets(size, mode));
  }, [board, size, mode]);

  return (
    <main className="md:flex md:flex-col flex-wrap max-h-screen min-h-screen">
      <section className="md:bg-[#F6F7F9] flex flex-col md:max-w-[600px] md:rounded-tr-2xl overflow-hidden md:h-[calc(100vh-55px)] order-1">
        <div className="p-3 md:p-6 !pb-0 mb-8 md:mb-0 xl:!px-10 bg-[#F6F7F9] rounded-b-xl mb:rounded-none">
          <h1 className="text-3xl lg:text-4xl font-semibold mt-4">
            Awesome Catan Board Generator
          </h1>
          <p className="md:text-lg font-thin my-5">
            Generate Settlers of Catan boards with this Awesome Catan Board
            Generator. With just one click, generate boards for both Classic or
            Expansion Pack.
          </p>

          <div className="rounded-lg flex items-center mb-4 space-x-3">
            <button
              onClick={() => setMode("normal")}
              className={clsx(
                "flex-1 py-2 rounded-lg border",
                mode === "normal"
                  ? "bg-gray-300 border-gray-300"
                  : "border-gray-400 hover:opacity-70"
              )}
            >
              Classic
            </button>

            <button
              onClick={() => setMode("expanded")}
              className={clsx(
                "flex-1 py-2 rounded-lg border",
                mode === "expanded"
                  ? "bg-gray-300 border-gray-300"
                  : "border-gray-400 hover:opacity-70"
              )}
            >
              Expansion
            </button>
          </div>

          <Button
            onClick={generateBoard}
            className="flex items-center justify-center space-x-2 w-full mb-5"
          >
            <BiShuffle className="text-xl" />
            <span>Shuffle</span>
          </Button>
        </div>

        <div className="flex items-center justify-center flex-1 w-full px-3 md:px-6 xl:px-10">
          <div className="flex items-center h-[240px] w-full md:h-full justify-center">
            {/* <h2 className="text-lg font-bold mb-2">Resource abundancy</h2> */}
            <ResourceGraph board={board} />
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-1.5 xl:px-8 md:h-screen order-3">
        <div className="relative w-screen h-[100vw] md:h-screen md:w-[100vh] flex items-center justify-center">
          {board.length > 0 && offsets.length > 0 && (
            <div>
              {mode === "normal" && (
                <picture className="block w-[99vw] h-[calc(99vw*0.866025404)] md:w-[99vh] md:h-[calc(99vh*0.866025404)]">
                  <source
                    srcSet="/images/background-1x.webp 1x, /images/background-2x.webp 2x"
                    type="image/webp"
                  />
                  <img
                    className="w-full h-full"
                    src="/images/background-1x.png"
                    srcSet="/images/background-1x.png 1x, /images/background-2x.png 2x"
                    alt="board background"
                  />
                </picture>
              )}
              {board.map((tile, index) => (
                <Tile
                  key={index}
                  num={tile.num}
                  resource={tile.resource}
                  offset={{ ...offsets[index] }}
                  mode={mode}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* <section id="popmenu" className="menuToggle">
          <h2 className="text-[25px] font-bold">Generation Custom Rules</h2>
          <br />
          <div className="settingswrap">
            <input id="selected-map" type="hidden" value="normal" />
            <div className="menu-row">
              <label className="mylabel">6 & 8 Can Touch</label>
              <input
                id="adjacent_6_8_input"
                onchange="toggleSetting('6_8')"
                type="checkbox"
              />
              <br />
            </div>
            <div className="menu-row">
              <label className="mylabel">2 & 12 Can Touch</label>
              <input
                id="adjacent_2_12_input"
                onchange="toggleSetting('2_12')"
                type="checkbox"
              />
              <br />
            </div>
            <div className="menu-row">
              <label className="mylabel">Same Numbers Can Touch</label>
              <input
                id="adjacent_same_numbers_input"
                onchange="toggleSetting('same_number')"
                type="checkbox"
              />
              <br />
            </div>
            <div id="sameResourceSetting" className="menu-row">
              <label className="mylabel">Same Resource Can Touch</label>
              <input
                id="adjacent_same_resource_input"
                onchange="toggleSetting('same_resource')"
                type="checkbox"
              />
              <br />
            </div>
            <button
              type="button"
              className="menuclosebutton"
              onclick="toggleOptions()"
            >
              Close Options
            </button>
          </div>
        </section> */}

      <Footer className="pb-5 md:pb-3 pt-4 md:pt-2 bg-[#F6F7F9] md:rounded-br-2xl md:order-2 md:max-w-[600px] md:flex-1" />
    </main>
  );
}
