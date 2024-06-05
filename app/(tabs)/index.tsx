// Choose your preferred renderer
import SkiaChart, { SVGRenderer } from "@wuba/react-native-echarts/skiaChart";
import * as echarts from "echarts/core";
import { useRef, useEffect } from "react";
import { GraphChart } from "echarts/charts";
import { Dimensions } from "react-native";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import mockData from "../../data/mockData.json";

// Register extensions
echarts.use([
  GraphChart,
  SVGRenderer,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

// Get the screen dimensions
// mTODO: Double check that this is the best way to do this
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const E_HEIGHT = 350;
// const E_WIDTH = 300;

// Initialize
function ChartComponent({ option }: any) {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    let chart: any;
    if (chartRef.current) {
      // @ts-ignore
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width: screenWidth,
        height: screenHeight,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [option]);

  // Choose your preferred chart component
  // return <SkiaChart ref={chartRef} />;
  return <SkiaChart style={{ backgroundColor: "white" }} ref={chartRef} />;
}

// !TODO: Chart seems to have invisible box around it and you can't click and drag if you don't click in the box. You should be able to press and drag anywhere on the screen

// Component usage
export default function TabOneScreen() {
  const option = {
    title: {
      text: "Les Miserables",
      subtext: "Default layout",
      top: "bottom",
      left: "right",
    },
    tooltip: {},
    legend: [
      {
        // selectedMode: "single",
        data: mockData.categories.map(function (a) {
          return a.name;
        }),
      },
    ],
    textStyle: { color: "#000000" },
    series: [
      {
        type: "graph",
        layout: "none",
        // symbolSize: 20,
        roam: true,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
        labelLayout: {
          hideOverlap: true,
        },
        scaleLimit: {
          min: 0.4,
          max: 2,
        },
        lineStyle: {
          color: "source",
        },
        edgeSymbol: ["circle"],
        edgeSymbolSize: [4, 4],
        edgeLabel: {
          fontSize: 20,
        },
        data: mockData.nodes,
        links: mockData.links,
        categories: mockData.categories,
        force: {
          repulsion: 500,
          edgeLength: 100,
        },
      },
    ],
  };

  return <ChartComponent option={option} />;
}
