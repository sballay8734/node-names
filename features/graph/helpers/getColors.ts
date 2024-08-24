import { nodeBgMap } from "@/constants/Colors";

import { INode2 } from "../types/graphManagementTypes";

export function getColors(node: INode2) {
  if (node.is_current_root) {
    return {
      inactiveBgColor: "transparent",
      sourceActiveBg: "",
      activeBgColor: "#66e889",
      inactiveBorderColor: "#121212",
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