import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Text as SkiaText } from "@shopify/react-native-skia";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import testNodes from "../../data/mainMockData.json";
import useWindowSize from "@/hooks/useWindowSize";
import AddConnectionBtn from "@/features/addConnection/AddConnectionBtn";
import Node from "@/features/graph/Node";
import { ROOT_NODE_RADIUS } from "@/constants/nodes";
import RootNode from "@/features/graph/RootNode";
import { INode } from "@/features/graph/types/graphTypes";
import MultiSelectToggle from "@/features/multiselect/MultiSelectToggle";
import NodeTapDetector from "@/features/graph/NodeTapDetector";

const nodes: INode[] = testNodes.nodes;

export interface INodeWSelect {
  [nodeId: string]: {
    id: number;
    rootNode: boolean;
    firstName: string;
    lastName: string;
    group: string | null;
    sex: string;
    isSelected: boolean;
  };
}

const Index = () => {
  const [nodeStates, setNodeStates] = useState<INodeWSelect | null>(null);
  const [isMultiMode, setIsMultiMode] = useState<boolean>(false);
  const [multiModeNodes, setMultiModeNodes] = useState<INode[]>([]);

  const windowSize = useWindowSize();

  const totalNodes = nodes.length - 1;

  function getYValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.sin(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterY;
  }

  function getXValue(index: number) {
    const angle = (index / totalNodes) * 2 * Math.PI;
    return Math.cos(angle) * ROOT_NODE_RADIUS + windowSize.windowCenterX;
  }

  function getNodePosition(node: INode, index: number) {
    if (node.rootNode) {
      return { x: windowSize.windowCenterX, y: windowSize.windowCenterY };
    } else {
      return { x: getXValue(index), y: getYValue(index) };
    }
  }

  // TODO: Handle this logic in redux (It currently re-renders ALL nodes)
  function handleNodeSelect(node: INode) {
    if (isMultiMode) {
      setMultiModeNodes((prevNodes) => {
        const nodeIndex = prevNodes.findIndex((n) => n.id === node.id);
        if (nodeIndex > -1) {
          // Node is already selected, remove it
          return prevNodes.filter((n) => n.id !== node.id);
        } else {
          // Node is not selected, add it
          return [...prevNodes, node];
        }
      });
    } else {
      setNodeStates((prevState) => {
        if (prevState === null || prevState[node.id]?.isSelected) {
          // If no node is selected or the clicked node is already selected, toggle it
          return {
            [node.id]: {
              ...node,
              isSelected: prevState === null || !prevState[node.id]?.isSelected,
            },
          };
        } else {
          // If another node is selected, deselect it and select the clicked node
          return { [node.id]: { ...node, isSelected: true } };
        }
      });
    }
  }

  const toggleMultiSelectMode = () => {
    setIsMultiMode((prevMode) => {
      if (prevMode) {
        // Turning off multi-mode
        setNodeStates(null);
        setMultiModeNodes([]);
      } else {
        // Turning on multi-mode
        if (nodeStates) {
          const selectedNode = Object.values(nodeStates).find(
            (node) => node.isSelected,
          );
          if (selectedNode) {
            setMultiModeNodes([selectedNode]);
          }
        }
        setNodeStates(null);
      }
      return !prevMode;
    });
  };

  console.log(multiModeNodes);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Canvas
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "#121212",
        }}
      >
        {/* NODES ********************************************************** */}
        {nodes.map((node, index) => {
          if (node.rootNode) {
            return (
              <RootNode node={node} windowSize={windowSize} key={node.id} />
            );
          } else {
            return (
              <Node
                node={node}
                index={index}
                totalNodes={totalNodes}
                windowSize={windowSize}
                key={node.id}
              />
            );
          }
        })}
      </Canvas>

      {/* GESTURE DETECTORS ************************************************ */}
      {nodes.map((node, index) => {
        const { x, y } = getNodePosition(node, index);
        return (
          <NodeTapDetector
            key={node.id}
            node={node}
            nodePosition={{ x, y }}
            nodeStates={nodeStates}
            isMultiMode={isMultiMode}
            multiModeNodes={multiModeNodes}
            handleNodeSelect={handleNodeSelect}
          />
        );
      })}

      {/* MultiSelect and AddConnectionBtn ******************************** */}
      <MultiSelectToggle
        isMultiMode={isMultiMode}
        toggleMultiSelectMode={toggleMultiSelectMode}
      />
      <AddConnectionBtn nodeStates={nodeStates} isMultiMode={isMultiMode} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121",
  },
});

export default Index;

// !TODO: FIRST FOR WED.
// !TODO: SHOULD BE MULTISELECT BY DEFAULT AND JUST REPLACE + button
// !TODO: REFACTOR ALL THIS GARBAGE
// TODO: Add CreateGroupBtn for multimode (Should just replace or change the icon of the AddConnectionBtn)
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: Change "rootNode" to "isRootNode"
