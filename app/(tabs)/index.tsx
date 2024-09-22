import React from "react";
import { StyleSheet, View } from "react-native";

import Graph from "@/features/Graph/components/Graph";
import NewNodeData from "@/features/Graph/components/Sheets/NewNodeData";
import useWindowSize from "@/lib/hooks/useWindowSize";

const Index = () => {
  useWindowSize();
  // const { dataIsLoading, error } = useDbData(windowSize);
  // if (dataIsLoading) {
  //   return null;
  // }
  // if (error) {
  //   console.error("Error getting data!");
  //   return null;
  // }

  return (
    <View style={[styles.container]}>
      <Graph />
      <NewNodeData />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(120, 32, 18, 0.6)", // Made semi-transparent
  },
});

export default Index;

// !TODO: Overlay group_name on graph

// !TODO: Animate links again AFTER refactoring all that shit and redoing LinkSvg.tsx and changing the way you track statuses of links, nodes, etcs

// !TODO: The way that links, groups, and nodes interact needs to be redone. It's not ideal right now to have groups separate from nodes if you have to constantly check what type the node is before you look something up. See graphSlice

// !TODO: COMPLETELY REDO LinkSvg.tsx   ********************!!!!!!!!!!!!!!!!!

// !TODO: If a node is active when clicked, it should be made the focusedNode and NOT deselected. It should only be deselected if it's clicked twice?

// !TODO: FOR BELOW: You'll likely need to create a group map while looping through the nodes so that when you loop through the nodeGroups, you can easily figure out how many are in each group and how to properly space/place them

// !TODO: Nodes should be placed in the CENTER of the group by default and keep fitting in a row until there is no more room. Then just increase the depth a bit

// !TODO: NEED TO CHECK TYPES OF GROUPS/NODES ETC... OPTIMIZE NEW posFunc!!

// !TODO: Deselect all does not update focusedNodeId

// !TODO: REFACTOR POSITIONING LOGIC

// !TODO: Fix arrow and gesture tracking

// !TODO: AFTER ADDING LOGIC FOR POPOVER AND INPUT FOR NEW NODE INFO, CLEAN UP ALL LOGIC RELATED TO ADDING and POSITIONING NEW NODES. IT IS GETTING OUT OF HAND AND IF YOU WAIT ANY LONGER IT WILL GET REALLY HARD TO DEBUG

// TODO: Still need to handle logic for cNSGFS

// TODO: If a node selection results in a child link that goes off the screen, the app should zoom out

// TODO: Style root node better (should be more obvious)

// TODO: Position group titles better

// TODO: Add support for adding new nodes (Probably use depth)

// TODO: YOU HAVE A MEMORY LEAK SOMEWHERE (It's small but as you press nodes it creeps up)

// TODO: How are you going to handle the press styles if you're showing svgs?

// TODO: Find a way to bold the group names but NOT the node names nicely

// TODO: postion group names properly on same angle as nodes from the group

// TODO: Links are not animating OUT FROM a node

// TODO: Make links connect to edges of nodes and not the centers

// TODO: Store color map in ui state so you don't have to run getNodeStyles constantly

// TODO: Cap the number of rootGroups to 7 AND the number of groups for non-root-nodes to about 2 or 3

// TODO: initial state set doesn't activate borders on rootGroupNodes

// TODO: update link based on if source AND target are active

// TODO: You can now remove all the calls to Dimensions and use the redux value

// TODO: Don't forget to handle long press and don't fire off the action if a user hold down

// TODO: You actually need to render links TO the groups THEN FROM the groups and to the nodes (REFACTOR EVERYTHING FIRST THOUGH)

// TODO: Why does root node turn blue if you inspect it? (realistically you should block the inspection of the current root node anyway... since it's already inspected... but it's worth looking into)
// TODO: "getPopoverBtns" REALLY needs a refactor
// TODO: Do we really need "centerNode" function in useArrowData? How is it different from the other two centering functions?
// TODO: TESTING STILL NEEDED on ALL action buttons
// TODO: Refactor needed in MANY places to styles an logic
// TODO: FOURTH: move popover stuff in "manageSelections" slice to UI slice
// TODO: FIFTH: get centerOnNode OUT of NodeTapDetector. Figure out a way to move it somewhere else!
// TODO: Text on node is node transitioned smoothly

// TODO: Setting userId should NOT happen inside of graphDataSlice (you just put it there temporarily). It should happen in it's own slice!

// TODO: Fix else if (false) in toggleNode reducer

// TODO: DOUBLE CHECK THAT YOU'RE TAKING ADVANTAGE OF D3 INDEXING IN YOU setInitialPostions function

// TODO: BEFORE YOU DO ANYTHING CHECK TYPE FLOW FROM INITIAL FETCH -> D3 -> Redux

// TODO: You MUST run d3 positioning logic inside useDbData BEFORE dispatching the data to state

// TODO: And how will you determine the initial state for isShown? Right now, by default it is true for ALL nodes simply for testing purposes

// TODO: Fix white screen flash while sign up request is happening and transitions to graph

// TODO: remove default value of "male" from node "sex" and profiles "sex" (you did this just to get around dumb error) YOU'LL HAVE TO FIX USER CREATION THOUGH

// TODO: Configure storage and access controls for storage

// TODO: You need to turn back on "Confirm "Email" email verification

// TODO: Animate colors and rotation in PlusIcon.tsx

// TODO: Add "pressed" states to action Btns

// TODO: Replace + border with sudo background so you can't see through

// TODO: MAYBE JUST ALWAYS SHOW ALL OPTIONS AND JUST GREY OUT THE ONES THAT ARE NOT USABLE (CREATE A SORT OF MINI DASHBOARD)

// TODO: I really don't like how the popover "right" and + button use hard coded "guestimates" for alignment

// TODO: You DEFINITELY have a memory leak somewhere. Your RAM is too high in performance monitor

// TODO: REMEMBER to fill in default values for certain PopoverActions (if there are no nodes selected, automatically populate the root as the source of a newNode or Group) -- THERE ARE MORE EXAMPLES OF THIS, BE SMART, DON'T ADD MORE BTNS

// TODO: You really need to optimize the way the PopoverActionBtns are rendered. Anytime one of them changes, they all re-render NOT GOOD

// TODO: You might need to add options like "uRawGroup"

// TODO: BY DEFAULT, if one node is selected, the plus button will default the source to the selected node

// TODO: BY DEFAULT, if NO node is selected, the plus button will default the source to the current_root_node

// TODO: Eventually add back "centering" functionality BUT IMPROVE IT

// TODO: Spouses should have a sudo node between them where links to children come out of

// TODO: You actually DON'T want to refetch the data when a newRootNode is set. There is no need for that. You should already have all the data you need

// TODO: Make children/spouse nodes smaller also and connect your connection with their spouse

// TODO: Search bar

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
