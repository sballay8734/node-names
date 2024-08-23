import { REG_TEXT_SIZE, ROOT_TEXT_SIZE } from "@/constants/variables";

import { INode2 } from "../types/graphManagementTypes";

export // TODO: Calc font size based on name length and circle size
// THIS IS JUST A QUICK WORKAROUND
function calcFontSize(node: INode2) {
  if (node.is_current_root) {
    return ROOT_TEXT_SIZE;
  } else {
    return REG_TEXT_SIZE - node.first_name.length / 2;
  }
}
