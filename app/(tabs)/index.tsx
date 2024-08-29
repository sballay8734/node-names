import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import GraphButtons from "@/features/Graph/components/GraphOverlay/GraphButtons";
import NodesWrapper from "@/features/Graph/components/NodesWrapper";
import useDbData from "@/lib/hooks/useDbData";
import { useGestures } from "@/lib/hooks/useGestures";
import { useGraphData } from "@/lib/hooks/useGraphData";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

const Index = () => {
  const windowSize = useWindowSize();
  const theme = useContext(CustomThemeContext);
  const { composed, scale, translateX, translateY, lastScale } = useGestures();
  const { dataIsLoading, error } = useDbData(windowSize);

  const vertices = useAppSelector(
    (state: RootState) => state.graphData.vertices,
  );
  const edges = useAppSelector((state: RootState) => state.graphData.edges);

  const { arrowData, showArrow, centerOnRoot, centerOnNode } = useGraphData({
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

  if (dataIsLoading) {
    return null;
  }

  if (error) {
    console.error("Error getting data!");
    return null;
  }

  // console.log("VERTICES:", vertices);
  // console.log("EDGES:", edges);

  return (
    <GestureDetector gesture={composed}>
      <View
        style={[styles.canvasWrapper, { backgroundColor: theme.bgBaseTest }]}
      >
        <Animated.View style={[styles.canvasWrapper, animatedStyle]}>
          {/* <LinksCanvas windowSize={windowSize} /> */}
          <NodesWrapper centerOnNode={centerOnNode} />
        </Animated.View>
        <GraphButtons
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
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001a2e",
  },
});

export default Index;

// DONE vvv
// -- FOR NOW, don't allow inspect of any nodes that have a depth_from_user that is greater than 1. You may need to do this eventually, but for now, there's really no need
// !TODO: "determineOptions" REALLY needs a refactor
// !TODO: Do we really need "centerNode" function in useArrowData? How is it different from the other two centering functions?
// !TODO: TESTING STILL NEEDED on ALL action buttons
// !TODO: Refactor needed in MANY places to styles an logic
// !TODO: FOURTH: move popover stuff in "manageSelections" slice to UI slice
// !TODO: FIFTH: get centerOnNode OUT of NodeTapDetector. Figure out a way to move it somewhere else!

// !TODO: Setting userId should NOT happen inside of graphDataSlice (you just put it there temporarily). It should happen in it's own slice!

// !TODO: Fix else if (false) in toggleVertex reducer

// !TODO: DOUBLE CHECK THAT YOU'RE TAKING ADVANTAGE OF D3 INDEXING IN YOU setInitialPostions function

// !TODO: BEFORE YOU DO ANYTHING CHECK TYPE FLOW FROM INITIAL FETCH -> D3 -> Redux

// !TODO: You MUST run d3 positioning logic inside useDbData BEFORE dispatching the data to state

// !TODO: And how will you determine the initial state for isShown? Right now, by default it is true for ALL nodes simply for testing purposes

// !TODO: Fix white screen flash while sign up request is happening and transitions to graph

// !TODO: remove default value of "male" from vertex "sex" and profiles "sex" (you did this just to get around dumb error) YOU'LL HAVE TO FIX USER CREATION THOUGH

// !TODO: Configure storage and access controls for storage

// !TODO: You need to turn back on "Confirm "Email" email verification

// !TODO: Animate colors and rotation in PlusIcon.tsx

// !TODO: Add "pressed" states to action Btns

// !TODO: Replace + border with sudo background so you can't see through

// !TODO: MAYBE JUST ALWAYS SHOW ALL OPTIONS AND JUST GREY OUT THE ONES THAT ARE NOT USABLE (CREATE A SORT OF MINI DASHBOARD)

// !TODO: I really don't like how the popover "right" and + button use hard coded "guestimates" for alignment

// !TODO: You DEFINITELY have a memory leak somewhere. Your RAM is too high in performance monitor

// !TODO: REMEMBER to fill in default values for certain PopoverActions (if there are no nodes selected, automatically populate the root as the source of a newNode or Group) -- THERE ARE MORE EXAMPLES OF THIS, BE SMART, DON'T ADD MORE BTNS

// !TODO: You really need to optimize the way the PopoverActionBtns are rendered. Anytime one of them changes, they all re-render NOT GOOD

// !TODO: You might need to add options like "ungroup"

// !TODO: BY DEFAULT, if one node is selected, the plus button will default the source to the selected node

// !TODO: BY DEFAULT, if NO node is selected, the plus button will default the source to the current_root_node

// !TODO: Eventually add back "centering" functionality BUT IMPROVE IT

// !TODO: Spouses should have a sudo node between them where links to children come out of

// !TODO: You actually DON'T want to refetch the data when a newRootNode is set. There is no need for that. You should already have all the data you need

// !TODO: Make children/spouse nodes smaller also and connect your connection with their spouse

// !TODO: Search bar

// OPTIMIZE: OPTIMIZATION Look deeper into initial render. The hooks are causing lots of rerenders

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
