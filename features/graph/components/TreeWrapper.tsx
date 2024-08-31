import { View } from "react-native";
import Animated from "react-native-reanimated";

import { WindowSize } from "@/lib/types/misc";
import { createTree, Node } from "@/lib/utils/newTreeGraphStrategy";

import Tree from "./Tree";

interface Props {
  data: Node;
  windowSize: WindowSize;
}

export default function TreeWrapper({ data, windowSize }: Props) {
  const { descendants, links } = createTree(data, windowSize);

  return <Tree descendants={descendants} links={links} />;
}
