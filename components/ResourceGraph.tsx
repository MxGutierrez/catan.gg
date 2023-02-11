import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { RESOURCE_PROBABILITY } from "@/utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  board: Board;
}

const images = [
  "/images/wood-resource.png",
  "/images/brick-resource.png",
  "/images/sheep-resource.png",
  "/images/wheat-resource.png",
  "/images/ore-resource.png",
];

export default function ResourceGraph({ board }: Props) {
  const resources = useMemo(() => {
    const resources = {
      wood: {
        label: "Wood",
        count: 0,
        color: "#668f57",
      },
      brick: {
        label: "Brick",
        count: 0,
        color: "#f5b027",
      },
      sheep: {
        label: "Sheep",
        count: 0,
        color: "#aede1f",
      },
      wheat: {
        label: "Wheat",
        count: 0,
        color: "#f5cf3b",
      },
      ore: {
        label: "Ore",
        count: 0,
        color: "#d6d0ce",
      },
    };

    board.forEach((tile) => {
      if (tile.resource !== "desert") {
        resources[tile.resource].count += RESOURCE_PROBABILITY[tile.num];
      }
    });

    return resources;
  }, [board]);

  return (
    // <div className="relative max-w-[500px] w-full flex items-center justify-center">
    <Bar
      height={200}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              dash: [3, 4],
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              padding: 15,
            },
          },
        },
        animation: {
          duration: 500,
        },
      }}
      data={{
        labels: Object.values(resources).map((resource) => resource.label),
        datasets: [
          {
            data: Object.values(resources).map((resource) => resource.count),
            backgroundColor: Object.values(resources).map(
              (resource) => resource.color
            ),
            borderRadius: 5,
          },
        ],
      }}
      plugins={[
        {
          id: "afterDraw",
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            xAxis.ticks.forEach((_value, index) => {
              const x = xAxis.getPixelForTick(index);
              const image = new Image();
              image.src = images[index];
              ctx.drawImage(image, x - 17, yAxis.bottom + 10, 35, 35);
            });
          },
        },
      ]}
    />
    // </div>
  );
}
