import { nodeBgMap } from "@/constants/Colors";

import { INode2 } from "../types/graphManagementTypes";

export function getColors(node: INode2) {
  if (node.is_current_root) {
    return {
      inactiveBgColor: "#121212",
      sourceActiveBg: "",
      activeBgColor: "#636363",
      inactiveBorderColor: "#262626",
      activeBorderColor: "rgba(245, 240, 196, 1)",
    };
  } else {
    return {
      inactiveBgColor: !node.group_id ? "#1e2152" : nodeBgMap[node.group_id],
      sourceActiveBg: !node.group_id
        ? "#1e2152"
        : nodeBgMap[node.group_id * 11],
      activeBgColor: !node.group_id
        ? "#1e2152"
        : nodeBgMap[node.group_id * 111],
      inactiveBorderColor: "transparent",
      activeBorderColor: "rgba(245, 240, 196, 1)",
    };
  }
}

// const NODE_COLORS = ["#4c55b7", "#099671", "#7e4db7", "#b97848", "#ad4332"];
