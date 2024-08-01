import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Easing, withTiming } from "react-native-reanimated";

import { INode } from "@/features/D3/types/d3Types";
import LinksCanvas from "@/features/Graph/components/LinksCanvas";
import Nodes from "@/features/Graph/components/Nodes";
import {
  CENTER_ON_SCALE,
  useGestures,
} from "@/features/Graph/hooks/useGestures";
import { useNewDataLoad } from "@/features/Graph/utils/useNewDataLoad";
import DeselectAllBtn from "@/features/GraphActions/components/DeselectAllBtn";
import InspectBtn from "@/features/GraphActions/components/InspectBtn";
import RecenterBtn from "@/features/GraphActions/components/RecenterBtn";
import { useArrowData } from "@/features/GraphActions/hooks/useArrowData";
import Popover from "@/features/Shared/Popover";
import SearchBar from "@/features/Shared/SearchBar";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useDataLoad } from "@/hooks/useDataLoad";
import useWindowSize from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";
import { getNthConnections } from "@/utils/getNthConnections";
import { calcNodePositions } from "@/utils/getNodePositions";

// REMOVE: User will be able to change this
const tempN = 0;

const Index = () => {
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const { arrowData, showArrow } = useArrowData({ translateX, translateY });
  const nodeIsSelected = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length > 0,
  );
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const windowSize = useWindowSize();

  useDataLoad();
  const { people, connections } = useNewDataLoad();

  useEffect(() => {
    if (activeRootNode && people && connections) {
      const nodesToShow = getNthConnections(
        activeRootNode?.id,
        people,
        connections,
        tempN,
      );

      if (!nodesToShow) return;

      const { people: filteredPeople, connections: filteredConnections } =
        nodesToShow;

      const { nodes, links } = calcNodePositions(
        filteredPeople,
        filteredConnections,
        windowSize,
        scale,
      );

      console.log(nodes, links);
    }
  }, [activeRootNode, connections, people, scale, windowSize]);

  function centerOnRoot() {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    lastScale.value = scale.value;
  }

  function centerOnNode(node: INode) {
    if (!nodeIsSelected) {
      translateX.value = withTiming(
        (windowSize.windowCenterX - node.x!) * CENTER_ON_SCALE,
        {
          duration: 500,
          easing: Easing.bezier(0.35, 0.68, 0.58, 1),
        },
      );
      translateY.value = withTiming(
        (windowSize.windowCenterY - node.y!) * CENTER_ON_SCALE,
        {
          duration: 500,
          easing: Easing.bezier(0.35, 0.68, 0.58, 1),
        },
      );
      scale.value = withTiming(CENTER_ON_SCALE, {
        duration: 500,
        easing: Easing.bezier(0.35, 0.68, 0.58, 1),
      });
      lastScale.value = CENTER_ON_SCALE;
    }
  }

  return (
    <GestureDetector gesture={composed}>
      <View style={[styles.canvasWrapper]}>
        <LinksCanvas
          windowSize={windowSize}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
        />
        {/* Nodes ********************************************************** */}
        <Nodes
          centerOnNode={centerOnNode}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
        />
        {/* Overlays && Absolute Btns ************************************** */}
        <Popover />
        <SearchBar />
        <RecenterBtn
          centerOnRoot={centerOnRoot}
          arrowData={arrowData}
          showArrow={showArrow}
        />
        <DeselectAllBtn />
        <InspectBtn />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    flex: 1,
    position: "relative",
    // backgroundColor: "rgba(255, 0, 0, 0.1)",
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
});

export default Index;

// Graph
// NodeManagement
// SelectionManagement

// UserProfile
// UI?

// FIRST FOR SAT. ****************************************************
// 1. "InspectBtn" and "DeselectAllBtn" should appear as group. They both should not be shown if nothing is selected and InspectBtn should be faded out (but still visible) if more than one node is selected
// 1a. Deselect should always be visible and when clicked, should NOT recenter to rootNode.

// 1. write function to get all connections for a given node (you may already have this)
// 2. Add widget to node that shows the number of connections that node has
// 3. Work on adding/connecting/grouping nodes (+ btn)
// 4. Add overlay over groups that fades out as you zoom in
// 5. recenter on select should not happen if node is being deselected
// 6. Should b3 THREE node states (inactive[darkest], sourceIsSelected[brighter], selfIsSelected[brightest])
// 7. WORK ON THEME AND REFACTOR STYLES THAT NEED IT (NODETAPDETECTOR)

// 8. Node is already centered when selected. So just make it bigger while fading it out to give the impression that you're zooming in. Fade all root primary connections out while doing this while fading in (from smaller to bigger) all primary connections TO THE SELECTED NODE.

// TODO: using nodeIsSelected in index.tsx is BETTER but not perfect. You're still getting one or two re-renders that you don't want

// !TODO: You might need to make Initial Scale much bigger. Zooming into the small nodes reveals blurry text

// TODO: See about replacing useState with useRef where possible (This likely won't be possible in many places but since ref doesn't trigger re-renders, it could help performance)

// TODO: Colors of TODO icons no longer match.

// TODO: Color nodes

// TODO: When connecting a node to the root, the root should always default to be the source in the database (optimization)

// !TODO: Current "add link" logic assumes a stationary graph (you will eventually need to track the postions of the links and nodes as they move by panning/pinching)

// TODO: little map in bottom right/left to show where you are in relation like in civs

// TODO: use custom icon for btn

// mTODO: Eventually change arrow in bottom left to a compass (SEE INSP Folder)

// !TODO: MAJOR: You MUST move .env variables EAS build when official releasing. env variables with PUBLIC are ONLY for development

// !TODO: RE-ENABLE RLS in Supabase

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
