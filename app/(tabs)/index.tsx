// Choose your preferred renderer
import SkiaChart, {
  SVGRenderer,
  SkiaChartProps,
} from "@wuba/react-native-echarts/skiaChart";
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
import { EChartOption } from "echarts/lib/echarts";
import { GraphSeriesOption, SeriesOption } from "echarts/types/dist/shared";

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
  return <SkiaChart ref={chartRef} />;
}

// !TODO: Chart seems to have invisible box around it and you can't click and drag if you don't click in the box. You should be able to press and drag anywhere on the screen

// Component usage
export default function TabOneScreen() {
  // !TODO: Everything seems to work EXCEPT THE TEXT COLOR????
  // DOCS: https://echarts.apache.org/v4/en/option.html#title

  // TODO: TYPE THIS "option"
  const option = {
    title: {
      show: true,
      text: "Les Miserables",
      subtext: "Default layout",
      top: "top",
      left: "right",
      textStyle: {
        color: "#fff",
        fontSize: 20,
      },
      backgroundColor: "red",
      borderWidth: 2,
      borderColor: "yellow",
    },
    // label: {
    //   show: true,
    //   position: "inside",
    //   color: "#fff",
    //   distance: 5,
    //   fontStyle: "normal",
    //   backgroundColor: "yellow",
    //   fontFamily: "sans-serif",
    //   fontSize: 12,
    //   formatter: "{b}",
    // },
    animationDuration: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        name: "Les Miserables",
        type: "graph",
        legendHoverLink: false,
        layout: "none",
        data: mockData.nodes,
        links: mockData.links,
        categories: mockData.categories,
        roam: true,
        symbol: "circle",
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          color: "red",
          backgroundColor: "yellow",
          fontStyle: "normal",
          fontSize: 4,
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        emphasis: {
          label: { show: true },
          lineStyle: {
            width: 10,
          },
          focus: "adjacency",
        },
      },
    ],
  };

  return <ChartComponent option={option} />;
}
