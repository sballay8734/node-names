import { View } from "react-native";

import { WindowSize } from "@/lib/types/misc";
import { createTree, Node } from "@/lib/utils/newTreeGraphStrategy";

import Tree from "./Tree";

interface Props {
  data: Node;
  windowSize: WindowSize;
}

export default function TreeWrapper({ data, windowSize }: Props) {
  const { descendants, links } = createTree(data, windowSize);

  return (
    <View style={{ flex: 1, backgroundColor: "green" }}>
      <Tree descendants={descendants} links={links} />
    </View>
  );
}
