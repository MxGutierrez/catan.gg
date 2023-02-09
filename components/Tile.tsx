import clsx from "clsx";

interface Props {
  num: number;
  resource: string;
  index: number;
  mode: Mode;
  offset: { left: number; top: number };
}

const probs = [
  "",
  "",
  ".",
  "..",
  "...",
  "....",
  ".....",
  "",
  ".....",
  "....",
  "...",
  "..",
  ".",
];

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
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(40%*1.73205/2)] w-[40%] border border-black bg-[#E3C586] rounded-full flex items-center justify-around",
            {
              hidden: resource === "desert",
            },
            {
              "-translate-x-1/2 -translate-y-1/2 -rotate-90":
                mode === "expanded",
            }
          )}
        >
          <p className="font-bantiqua font-bold text-[4.5vh]">{num}</p>
          <span className="prob-dots-base small-font-size-wrap">
            {probs[num]}
          </span>
        </div>
      )}
    </div>
  );
}
