import clsx from "clsx";
import { RESOURCE_PROBABILITY } from "@/utils/constants";

interface Props {
  num: number;
  resource: string;
  index: number;
  mode: Mode;
  offset: { left: number; top: number };
}

export default function Tile({ num, resource, mode, offset }: Props) {
  return (
    <div
      className={clsx(
        "absolute bg-no-repeat -translate-x-1/2 -translate-y-1/2",
        {
          "text-red-600": num === 6 || num === 8,
        },
        mode === "normal"
          ? "h-[17.5%] w-[calc(17.5%*0.866)]"
          : "h-[16%] w-[calc(16.5%*0.866)] origin-center rotate-90"
      )}
      style={{
        left: `${offset.left}%`,
        top: `${offset.top}%`,
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={`/images/${resource}-1x.png`}
          className="absolute top-0 right-0 h-full w-full -z-10"
          srcSet={`/images/${resource}-1x.png 1x, /images/${resource}-2x.png 2x, /images/${resource}-3x.png 3x, /images/${resource}-4x.png 4x`}
        />

        {resource !== "desert" && (
          <div
            className={clsx(
              "h-[calc(45%*1.73205/2)] w-[45%] border-gray-600 bg-[#f5dba3] rounded-full flex flex-col items-center justify-center tile",
              {
                hidden: resource === "desert",
              },
              {
                "-rotate-90": mode === "expanded",
              }
            )}
          >
            <p
              className={clsx(
                "font-bantiqua font-bold !leading-3 mt-0.5 sm:mt-1",
                num >= 10
                  ? "text-[3.8vw] md:text-3xl"
                  : "text-[4vw] md:text-4xl"
              )}
            >
              {num}
            </p>
            <div className="text-[3vw] md:text-[1.6rem] !leading-3 -mt-1.5 sm:mt-0">
              {Array.from({ length: RESOURCE_PROBABILITY[num] }).map(
                (_, index) => (
                  <span key={index}>.</span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
