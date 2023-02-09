import clsx from "clsx";

interface Props {
  num: number;
  resource: string;
  index: number;
  mode: Mode;
  offset: { left: number; top: number };
}

const probs: {
  [key: number]: number;
} = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
};

export default function Tile({ num, resource, mode, offset }: Props) {
  return (
    <div
      className={clsx(
        "hex-base absolute bg-no-repeat -translate-x-1/2 -translate-y-1/2 bg-[length:99%_99%]",
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
        backgroundImage: `url(/images/${resource}.png)`,
      }}
    >
      {resource !== "desert" && (
        <div
          className={clsx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(45%*1.73205/2)] w-[45%] border-gray-600 bg-[#f5dba3] rounded-full flex flex-col items-center justify-center tile",
            {
              hidden: resource === "desert",
            },
            {
              "-translate-x-1/2 -translate-y-1/2 -rotate-90":
                mode === "expanded",
            }
          )}
        >
          <p
            className={clsx(
              "font-bantiqua font-bold !leading-3 mt-1",
              num >= 10 ? "text-[3.8vw] md:text-3xl" : "text-[4vw] md:text-4xl"
            )}
          >
            {num}
          </p>
          <div className="text-[3vw] md:text-[1.6rem] !leading-3">
            {Array.from({ length: probs[num] }).map((_, index) => (
              <span key={index}>.</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
