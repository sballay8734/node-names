import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useCustomTheme } from "@/components/CustomThemeContext";
import { PositionedNode } from "@/features/D3/types/d3Types";
import {
  calcNodePositions,
  EnhancedPerson,
} from "@/features/D3/utils/getNodePositions";
import LinksCanvas from "@/features/Graph/components/LinksCanvas";
import Nodes from "@/features/Graph/components/Nodes";
import {
  CENTER_ON_SCALE,
  INITIAL_SCALE,
  useGestures,
} from "@/features/Graph/hooks/useGestures";
import {
  setUserLinks,
  setUserNodes,
} from "@/features/Graph/redux/graphManagement";
import { getShownNodesAndConnections } from "@/features/Graph/utils/getShownNodesAndConnections";
import { useDataLoad } from "@/features/Graph/utils/useDataLoad";
import BackToUserBtn from "@/features/GraphActions/components/BackToUserBtn";
import DeselectAllBtn from "@/features/GraphActions/components/DeselectAllBtn";
import InspectBtn from "@/features/GraphActions/components/InspectBtn";
import RecenterBtn from "@/features/GraphActions/components/RecenterBtn";
import { useArrowData } from "@/features/GraphActions/hooks/useArrowData";
import Popover from "@/features/Shared/Popover";
import SearchBar from "@/features/Shared/SearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import useWindowSize from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";
import { Tables } from "@/types/dbTypes";

const Index = () => {
  const theme = useCustomTheme();
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const { arrowData, showArrow } = useArrowData({ translateX, translateY });
  const dispatch = useAppDispatch();
  const nodeIsSelected = useAppSelector(
    (state: RootState) => state.selections.selectedNodes.length > 0,
  );
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const windowSize = useWindowSize();

  const { people, connections } = useDataLoad();

  useEffect(() => {
    if (activeRootNode && people && connections) {
      const nodesAndConnections: {
        shownNodes: EnhancedPerson[];
        finalConnections: Tables<"connections">[];
      } = getShownNodesAndConnections(people, connections, activeRootNode);

      if (!nodesAndConnections) return;

      const { shownNodes, finalConnections } = nodesAndConnections;

      // calculate position of nodes
      const { nodes, links } = calcNodePositions(
        shownNodes,
        finalConnections,
        windowSize,
        scale,
        activeRootNode,
      );

      dispatch(setUserNodes(nodes));
      dispatch(setUserLinks(links));

      centerOnRoot();
    }
  }, [activeRootNode, connections, dispatch, people, scale, windowSize]);

  function centerOnRoot() {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.35, 0.68, 0.58, 1),
    });
    scale.value = withTiming(
      INITIAL_SCALE,
      { duration: 500, easing: Easing.bezier(0.35, 0.68, 0.58, 1) },
      (finished) => {
        if (finished) {
          lastScale.value = scale.value; // Set lastScale after the animation is done
        }
      },
    );
  }

  function centerOnNode(node: PositionedNode) {
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View
        style={[
          styles.canvasWrapper,
          {
            backgroundColor: theme.bgBaseTest,
          },
        ]}
      >
        <Animated.View style={[styles.canvasWrapper, animatedStyle]}>
          {/* Links ******************************************************** */}
          <LinksCanvas windowSize={windowSize} />
          {/* Nodes ******************************************************** */}
          <Nodes centerOnNode={centerOnNode} />
        </Animated.View>
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
        <BackToUserBtn />
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

// DONE vvv
// -- FOR NOW, don't allow inspect of any nodes that have a depth_from_user that is greater than 1. You may need to do this eventually, but for now, there's really no need

// !TODO: FIRST ("Me" btn is not working)

// !TODO: When root changes make sure to animate OUT and IN the other nodes. Currently they leave/change very abruptly

// !TODO: Spouses should have a sudo node between them where links to children come out of

// !TODO: Add back button when inside and inspected node

// !TODO: Need to clean up types and remove columns in db that are no longer needed

// !TODO: You actually DON'T want to refetch the data when a newRootNode is set. There is no need for that. You should already have all the data you need

// !TODO: Why do Mackenzie, Carmen and Joe have hidden conns when Aaron is root? (Log hiddenConnections to find out) - Joe's and Carmens has to do with Grandparent/grandchild and Mackenzies has to do with niece/nephew

// !TODO: Make children/spouse nodes smaller also and connect your connection with their spouse

// !TODO: Search bar

// TODO: using nodeIsSelected in index.tsx is BETTER but not perfect. You're still getting one or two re-renders that you don't want

// TODO: See about replacing useState with useRef where possible (This likely won't be possible in many places but since ref doesn't trigger re-renders, it could help performance)

// TODO: Colors of TODO icons no longer match.

// TODO: little map in bottom right/left to show where you are in relation like in civs

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
