import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useCustomTheme } from "@/components/CustomThemeContext";
import ControlButtons from "@/features/Graph/components/ControlButtons";
import LinksCanvas from "@/features/Graph/components/LinksCanvas";
import Nodes from "@/features/Graph/components/Nodes";
import { useGestures } from "@/features/Graph/hooks/useGestures";
import { useGraphData } from "@/features/Graph/hooks/useGraphData";
import { useAppSelector } from "@/hooks/reduxHooks";
import useWindowSize from "@/hooks/useWindowSize";
import { RootState } from "@/store/store";

const Index = () => {
  const theme = useCustomTheme();
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const windowSize = useWindowSize();

  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );

  const { arrowData, showArrow, centerOnRoot, centerOnNode } = useGraphData({
    activeRootNode,
    scale,
    translateX,
    translateY,
    windowSize,
    lastScale,
  });

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
        style={[styles.canvasWrapper, { backgroundColor: theme.bgBaseTest }]}
      >
        <Animated.View style={[styles.canvasWrapper, animatedStyle]}>
          <LinksCanvas windowSize={windowSize} />
          <Nodes centerOnNode={centerOnNode} />
        </Animated.View>
        <ControlButtons
          arrowData={arrowData}
          showArrow={showArrow}
          centerOnRoot={centerOnRoot}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    flex: 1,
    position: "relative",
  },
});

export default Index;

// DONE vvv
// -- FOR NOW, don't allow inspect of any nodes that have a depth_from_user that is greater than 1. You may need to do this eventually, but for now, there's really no need

// !TODO: WORKING ON useGraphData.ts

// !TODO: WHY IS THERE STILL MASSIVE LAG WHEN SWITCHING ROOTS

// !TODO: There is a bug when you unselect Aaron as the root using "me" (has something to do with the active/inactive state of the node)

// !TODO: Why is pressing "me" btn and "inspect" btn press-out animation SOOO slow (is something or many things re-rendering?)

// !TODO: LOAD ALL NODES INITIALLY AND USE A HASHMAP TO CONTROL THEIR STATE AND LOCATION (SO ALL NODES SHOULD BE ON SCREEN AT ALL TIMES BUT SOME WILL BE HIDDEN and have no pointer events)

// !TODO: Spouses should have a sudo node between them where links to children come out of

// !TODO: You actually DON'T want to refetch the data when a newRootNode is set. There is no need for that. You should already have all the data you need

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
