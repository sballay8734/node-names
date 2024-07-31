import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Easing, withTiming } from "react-native-reanimated";

import { useArrowData } from "@/features/graph/hooks/useArrowData";
import {
  CENTER_ON_SCALE,
  useGestures,
} from "@/features/graph/hooks/useGestures";
import InspectBtn from "@/features/graph/InspectBtn";
import LinksCanvas from "@/features/graph/LinksCanvas";
import Nodes from "@/features/graph/Nodes";
import RecenterBtn from "@/features/graph/RecenterBtn";
import SearchBar from "@/features/graph/SearchBar";
import Popover from "@/features/manageSelections/Popover";
import { useTestDataLoad } from "@/hooks/useTestDataLoad";
import useWindowSize from "@/hooks/useWindowSize";
import { PositionedPerson } from "@/utils/positionGraphElements";

const Index = () => {
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const { arrowData, showArrow } = useArrowData({ translateX, translateY });
  const windowSize = useWindowSize();
  // useDataLoad();
  useTestDataLoad();

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

  function centerOnNode(node: PositionedPerson) {
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

  return (
    <GestureDetector gesture={composed}>
      <View style={[styles.canvasWrapper]}>
        <LinksCanvas
          windowSize={windowSize}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
        />
        {/* Nodes ************************************** */}
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
        <InspectBtn />
        {/* !TODO: "Inspect" icon AND Compass should control it's own state by accessing the length of selectedNodes directly */}
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

// !TODO: Center node's background still doesn't transition when selected

// !TODO: You might need to make Initial Scale much bigger. Zooming into the small nodes reveals blurry text

// !TODO: panning root off screen, then make change to Nodes.tsx and save the file. Then click recenter. Then click root node (links shoot off the screen. The SVG scales but the nodes do not)

// !TODO: Don't center on a node if a node is already selected but DON'T put that logic in this component (if you use selectedNodes from redux ALL NODES AND LINKS WILL RERENDER EVERY TIME YOU SELECT ANY NODE)

// TODO: ARROW DOESN'T SHOW SOMETIMES AND IT'S DIRECTION IS NOT QUITE RIGHT when root goes off the screen on the left side and bottom right

// TODO: Colors of TODO icons no longer match.

// TODO: Color nodes

// TODO: Add alive/dead, and preferredName property

// TODO: Add widget to show how many "internal" connections each primary connection has

// TODO: "Enter/ZoomIn/Magnify" btn should appear when only one node is selected and that node has "internal" connections that will allow the user to "zoom" in to that persons connections

// TODO: SEPARATE PIECE OF STATE FOR SELECTED NODE and CONNECTIONS WHEN ZOOMING IN.

// TODO: Also include groupName in Node object (not just the id)

// TODO: When connecting a node to the root, the root should always default to be the source in the database (optimization)

// !TODO: Don't center if a node is already selected

// TODO: Add counter for how many nodes are selected

// TODO: Add "Deselect All" btn

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
