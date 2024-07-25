import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Easing, withTiming } from "react-native-reanimated";

import { useArrowData } from "@/features/graph/hooks/useArrowData";
import { useDataLoad } from "@/features/graph/hooks/useDataLoad";
import { useGestures } from "@/features/graph/hooks/useGestures";
import LinksCanvas from "@/features/graph/LinksCanvas";
import Nodes from "@/features/graph/Nodes";
import RecenterBtn from "@/features/graph/RecenterBtn";
import SearchBar from "@/features/graph/SearchBar";
import Popover from "@/features/manageSelections/Popover";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useTestDataLoad } from "@/hooks/useTestDataLoad";
import useWindowSize from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";
import { PositionedPerson } from "@/utils/positionGraphElements";

const INITIAL_SCALE = 0.5;

const Index = () => {
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const { arrowData, showArrow } = useArrowData({ translateX, translateY });
  const windowSize = useWindowSize();
  // useDataLoad();
  useTestDataLoad();

  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );

  function centerOnRoot() {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    lastScale.value = withTiming(1, { duration: 500 });

    scale.value = withTiming(INITIAL_SCALE, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
  }

  function centerOnNode(node: PositionedPerson) {
    // !TODO: This early return works but is wrong. Race condition with redux
    if (selectedNodes.length >= 1) return;

    translateX.value = withTiming(windowSize.windowCenterX - node.x!, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(windowSize.windowCenterY - node.y!, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    lastScale.value = withTiming(lastScale.value, { duration: 500 });

    // REVIEW: Changing from 1 to any other number takes the zoom out of sync. This works with a value of 1 but should probably be changed so users can change their default zoom when selecting a node
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
  }

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.canvasWrapper}>
        <LinksCanvas
          windowSize={windowSize}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
        />
        {/* Nodes ****************************************** */}
        <Nodes
          centerOnNode={centerOnNode}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
        />
        {/* Overlays */}
        <Popover />
        <SearchBar />
        <RecenterBtn
          centerOnRoot={centerOnRoot}
          arrowData={arrowData}
          showArrow={showArrow}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
  tapWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(150, 4, 255, 0.3)",
    top: 0,
    left: 0,
    flex: 1,
  },
});

export default Index;

// FIRST FOR THURS. ****************************************************
// TODO: When connecting a node to the root, the root should always default to be the source in the database (optimization)

// !TODO: (SEEMS TO BE FIXED) There is some sort of bug when you do some selecting, panning, then deselect all nodes then save file (probably has to do with selectedNodes being empty after deselecting the last node)

// !TODO: Don't center if a node is already selected

// TODO: Add counter for how many nodes are selected

// TODO: Add "Deselect All" btn

// TODO: Add search bar that expands to the left like the apple Music one

// TODO: Links should attach to edge of circle and not the center

// !TODO: Pinch should use focusX and focusY

// !TODO: Define the strength of each connection when the connection is created (NEED TO MODIFY LINK INTERFACE) -- SEE THIS BLOG for example of families and coloring (https://weser.io/blog/interactive-dynamic-force-directed-graphs-with-d3)

// !TODO: Current "add link" logic assumes a stationary graph (you will eventually need to track the postions of the links and nodes as they move by panning/pinching)

// !TODO: Refactor idea, render the links on each node ONLY on a source node. (So your node component could be something like "if (node is source node" -> render link to the target. You need a way to add links without re-rendering everysingle node + link)

// 2. Work all "Add Btn" functionality
// 2. Assume everyone starts with only the root node and build from there
// 2a. Based on 2, start with connecting a new node to the root - and creating a node NOT connected to the root WITH LINKS
// 3. After 2a, work on grouping logic

// !TODO: DOUBLE CHECK THAT NODES ARE ALIGNED
// !!!!!!!!!! STOP: REFACTOR EVERYTHING BEFORE MOVING FORWARD !!!!!!!!!!

// !TODO: How to handle spouse groups (do you put Rachel in friends? She IS your friend but she is better categorized as aarons wife). When grouping your friends you probably also want their spouses to be in the group also

// TODO: use custom icon for btn
// TODO: Recenter button should be an arrow that ALWAYS points towards root (so you'll need to animate the rotation)
// TODO: Remove the group in RootNode and Node if you stick with rendering the text in the GestureDetector
// mTODO: You shouldn't have to do ROOT_NODE_RADIUS / 2 anywhere
// mTODO: Pinch Center doesn't quite align with RootNode center
// mTODO: Change "rootNode" to "isRootNode"
// mTODO: Eventually change arrow in bottom left to a compass (SEE INSP Folder)
// !TODO: MAJOR: You MUST move .env variables EAS build when official releasing. env variables with PUBLIC are ONLY for development

// IDEAS ***********************************************************************
// 1. Quizzes on specific groups/people/ etc..
// 2. How to handle halfbrothers-cousins-divorces-etc...
// 3. Groups within groups within groups
// 4. Spouses should be connected with a special "frame" around them
// 5. Clicking the middle of the frame will select both (to add children), but clicking on individuals still works
// 6. Different frames for Spouses/Dating
// 7. Selecting whole groups should provide the option to add an "Encompassing Group" or "Internal Group"
// 8. Different Views - "Group View" would zoom out, hide individual names, and show group names instead. "Node View" would zoom in and show individual names and hide group names/color fills
// 9. Search functionality by group/individual/ etc..

// Unique OBJECT/PEOPLE PROPERTIES
// NOTE: All in the spirit of being a better friend/person/coworker
// 1. "Gift Ideas" - ability to create a list of gift ideas for each person
// 2. "Phonetic Pronunciation" - For people with names whose pronuciation isn't clear.

// Possible App Names **********************************************************
// LifeLink, KinKeeper, something with "Web"?, "KinConnect"
