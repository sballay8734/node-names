import { UiNode } from "../types/graph";

export function getColors(node: UiNode) {
  const isRoot = node.depth === 1;
  const isGroup = node.type === "group";
  const groupName = node.group_name;

  // setRootNodeColors
  function getNewRgba(r: number, g: number, b: number, a: number) {
    const newR = Math.round(255 - a * (255 - r));
    const newG = Math.round(255 - a * (255 - g));
    const newB = Math.round(255 - a * (255 - b));
    return `rgba(${newR}, ${newG}, ${newB}, 1)`;
  }
  // FALLBACK COLORS ***********************************************************
  const fbR = 166;
  const fbG = 166;
  const fbB = 166;
  const fbColors = {
    active: getNewRgba(fbR, fbG, fbB, 1),
    parent_active: getNewRgba(fbR, fbG, fbB, 0.8),
    inactive: getNewRgba(fbR, fbG, fbB, 0.5),
  };

  // ROOT NODE COLORS **********************************************************
  const rootR = 247;
  const rootG = 0;
  const rootB = 255;
  const rootColors = {
    active: getNewRgba(rootR, rootG, rootB, 1),
    parent_active: getNewRgba(rootR, rootG, rootB, 0.8),
    inactive: getNewRgba(rootR, rootG, rootB, 0.5),
  };

  // GROUP 1 *******************************************************************
  const group1R = 255;
  const group1G = 190;
  const group1B = 25;
  // GROUP 2 *******************************************************************
  const group2R = 15;
  const group2G = 175;
  const group2B = 255;
  // GROUP 3 *******************************************************************
  const group3R = 245;
  const group3G = 61;
  const group3B = 48;
  // GROUP 4 *******************************************************************
  const group4R = 48;
  const group4G = 245;
  const group4B = 107;
  // GROUP 5 *******************************************************************
  const group5R = 48;
  const group5G = 245;
  const group5B = 107;

  const groupMap: {
    [key: string]: { active: string; parent_active: string; inactive: string };
  } = {
    Online: {
      active: getNewRgba(group1R, group1G, group1B, 1),
      parent_active: getNewRgba(group1R, group1G, group1B, 0.8),
      inactive: getNewRgba(group1R, group1G, group1B, 0.5),
    },
    Friends: {
      active: getNewRgba(group2R, group2G, group2B, 1),
      parent_active: getNewRgba(group2R, group2G, group2B, 0.8),
      inactive: getNewRgba(group2R, group2G, group2B, 0.5),
    },
    Work: {
      active: getNewRgba(group3R, group3G, group3B, 1),
      parent_active: getNewRgba(group3R, group3G, group3B, 0.8),
      inactive: getNewRgba(group3R, group3G, group3B, 0.5),
    },
    School: {
      active: getNewRgba(group4R, group4G, group4B, 1),
      parent_active: getNewRgba(group4R, group4G, group4B, 0.8),
      inactive: getNewRgba(group4R, group4G, group4B, 0.5),
    },
    Family: {
      active: getNewRgba(group5R, group5G, group5B, 1),
      parent_active: getNewRgba(group5R, group5G, group5B, 0.8),
      inactive: getNewRgba(group5R, group5G, group5B, 0.5),
    },
    Fallback: {
      active: getNewRgba(fbR, fbG, fbB, 1),
      parent_active: getNewRgba(fbR, fbG, fbB, 0.8),
      inactive: getNewRgba(fbR, fbG, fbB, 0.5),
    },
  };

  if (isRoot) return rootColors;
  if (isGroup && groupName) return groupMap[groupName];

  return fbColors;

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
