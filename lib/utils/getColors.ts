import { UiNode } from "../types/graph";

export function getColors(node: UiNode) {
  const isRoot = node.depth === 1;
  const isGroup = node.type === "group";
  const groupName = node.group_name;

  const groupMap: {
    [key: string]: { active: string; parent_active: string; inactive: string };
  } = {
    Root: {
      active: "rgba(89, 173, 246, 1)", // sky blue
      parent_active: "#356793", // Not possible
      inactive: "#1a3349",
    },
    Online: {
      active: "rgba(157, 148, 255, 1)", // purple
      parent_active: "#5e5899",
      inactive: "#2f2c4c",
    },
    Friends: {
      active: "rgba(199, 128, 232, 1)", // pink
      parent_active: "#774c8b",
      inactive: "#3b2645",
    },
    Work: {
      active: "rgba(66, 214, 164, 1)", // green
      parent_active: "#278063",
      inactive: "#134031",
    },
    School: {
      active: "rgba(248, 243, 141, 1)", // yellow
      parent_active: "#949154",
      inactive: "#4a482a",
    },
    Family: {
      active: "rgba(255, 105, 97, 1)", // red
      parent_active: "#993f3a",
      inactive: "#4c1f1d",
    },
    Fallback: {
      active: "rgba(255, 180, 128, 1)", // orange
      parent_active: "#996c4c",
      inactive: "#4c3626",
    },
    Fallback2: {
      active: "rgba(8, 202, 209, 1)", // ocean blue
      parent_active: "#04797d",
      inactive: "#023c3e",
    },
    // Fallback3: {},
  };

  if (isRoot) return groupMap["Root"];
  if (isGroup && groupName) return groupMap[groupName];
  if (!isGroup && groupName) return groupMap[groupName];

  return groupMap["Fallback"];

  // export const nodeBgMap: { [key: number]: string } = {
  //   // inactive
  //   1: "rgba(83, 64, 14, 1)", // yellow
  //   2: "rgba(11, 59, 83, 1)", // blue
  //   3: "rgba(80, 25, 21, 1)", // red
  //   4: "rgba(21, 80, 39, 1)", // green
  //   5: "rgba(30, 33, 82, 1)", // purple

  //   // source active
  //   11: "rgba(255, 190, 25, 1)",
  //   22: "rgba(15, 175, 255, 1)",
  //   33: "rgba(245, 61, 48, 1)",
  //   44: "rgba(48, 245, 107, 1)",
  //   55: "rgba(189, 48, 245, 1)",

  //   // active
  //   111: "rgba(255, 190, 25, 1)",
  //   222: "rgba(15, 175, 255, 1)",
  //   333: "rgba(245, 61, 48, 1)",
  //   444: "rgba(48, 245, 107, 1)",
  //   555: "rgba(189, 48, 245, 1)",
  // };

  // get group shade
}

// const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];
