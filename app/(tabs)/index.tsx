import { Canvas, Group, Line, Paint } from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ARROW_BTN_RADIUS, TAB_BAR_HEIGHT } from "@/constants/styles";
import NodeTapDetector from "@/features/graph/NodeTapDetector";
import RecenterBtn from "@/features/graph/RecenterBtn";
import Popover from "@/features/manageSelections/Popover";
import useDbData from "@/hooks/useDbData";
import useWindowSize from "@/hooks/useWindowSize";
import {
  calculatePositions,
  FinalizedLink,
  PositionedPerson,
} from "@/utils/positionGraphElements";
// import Node from "@/features/graph/Node";
// import RootNode from "@/features/graph/RootNode";
// import { Canvas, Group } from "@shopify/react-native-skia";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const INITIAL_SCALE = 0.4;

const ARROW_BTN_LEFT = 10;
const ARROW_BTN_BTM = 10;

const Index = () => {
  const windowSize = useWindowSize();
  const [finalizedPeople, setFinalizedPeople] = useState<
    PositionedPerson[] | null
  >(null);
  const [finalizedLinks, setFinalizedLinks] = useState<FinalizedLink[] | null>(
    null,
  );

  const scale = useSharedValue(INITIAL_SCALE);
  // origin = point on Group directly under center point on Canvas
  const origin = useSharedValue({
    x: windowSize.windowCenterX,
    y: windowSize.windowCenterY,
  });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(INITIAL_SCALE);

  const ARROW_BTN_CENTER = {
    x: ARROW_BTN_LEFT + ARROW_BTN_RADIUS, // Left margin AND CENTER of button
    y: windowSize.height - TAB_BAR_HEIGHT - ARROW_BTN_BTM - ARROW_BTN_RADIUS,
  };

  // !TODO: vvvvvvvvvvvvvvvvvv CURRENT WORKING AREA vvvvvvvvvvvvvvvvvvvvvvv

  const { people, connections, groups, error } = useDbData();

  useEffect(() => {
    if (!finalizedPeople && people && connections) {
      const { nodes, links } = calculatePositions(
        people,
        connections,
        windowSize,
      );
      setFinalizedPeople(nodes);
      setFinalizedLinks(links as FinalizedLink[]);
    }
  }, [finalizedPeople, people, windowSize, connections]);

  // !TODO: ^^^^^^^^^^^^^^^^^^^ CURRENT WORKING AREA ^^^^^^^^^^^^^^^^^^^^^^^

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  });

  const pinch = Gesture.Pinch()
    .onChange((e) => {
      const newScale = Math.min(
        Math.max(scale.value * e.scale, MIN_SCALE),
        MAX_SCALE,
      );

      scale.value = newScale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Race(pan, pinch);

  const tapTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  const svgTransform = useDerivedValue(() => [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: scale.value },
  ]);

  const arrowData = useDerivedValue(() => {
    const rootNodePos = {
      x: windowSize.windowCenterX + translateX.value,
      y: windowSize.windowCenterY + translateY.value,
    };

    // Calculate the differences in x and y coordinates
    const dx = rootNodePos.x - ARROW_BTN_CENTER.x;
    const dy = rootNodePos.y - ARROW_BTN_CENTER.y;

    // Calculate the angle in radians
    const angle = Math.atan2(dy, dx);

    // Convert the angle to degrees
    const angleInDegrees = (angle * 180) / Math.PI;

    return {
      transform: [{ rotate: `${angleInDegrees}deg` }],
    };
  });

  const showArrow = useDerivedValue(() => {
    // check if rootNode is on scre
    let shown: boolean = false;
    if (
      windowSize.windowCenterX - Math.abs(translateX.value) < 0 ||
      windowSize.windowCenterY - Math.abs(translateY.value) < 0
    ) {
      shown = true;
    } else {
      shown = false;
    }

    return shown;
  });

  function handleCenter() {
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

  console.log("SCALE:", scale);
  console.log("ORIGIN:", origin);
  console.log("TRANSLATEX:", translateX.value);
  console.log("TRANSLATEY:", translateY.value);
  console.log(lastScale);

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.canvasWrapper}>
        <Canvas style={{ flex: 1, backgroundColor: "transparent" }}>
          {/* Links ******************************************************** */}
          <Group
            origin={{
              x: origin.value.x,
              y: origin.value.y,
            }}
            transform={svgTransform}
          >
            {finalizedLinks &&
              finalizedPeople &&
              finalizedLinks.map((link) => {
                {
                  return (
                    <Line
                      key={`${link.person_1_id}-${link.person_2_id}`}
                      p1={{
                        x: link.source.x,
                        y: link.source.y,
                      }}
                      p2={{ x: link.target.x, y: link.target.y }}
                      color="transparent" // Adjust color as needed
                      style="stroke"
                      strokeWidth={1} // Adjust thickness as needed
                    >
                      <Paint
                        color="#1c1c24"
                        strokeWidth={2}
                        style="stroke"
                        strokeCap="round"
                      />
                    </Line>
                  );
                }
              })}
          </Group>
        </Canvas>
        {/* Touch Responders ***************************************** */}
        <Animated.View
          style={{ ...styles.tapWrapper, transform: tapTransform }}
        >
          {finalizedPeople &&
            finalizedPeople.map((node) => {
              const { x, y } = node;

              if (x && y) {
                return (
                  <NodeTapDetector
                    key={node.id}
                    node={node}
                    nodePosition={{ x, y }}
                  />
                );
              } else {
                return null;
              }
            })}
        </Animated.View>
        <Popover />
        <RecenterBtn
          handleCenter={handleCenter}
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
    backgroundColor: "rgba(255, 0, 0, 0)",
    // WARNING: Adding border here will screw up layout slightly (BE CAREFUL)
  },
  canvas: {
    flex: 1,
    backgroundColor: "rgba(0, 4, 255, 0.5)", // BLUE
    opacity: 0.3,
  },
  tapWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    flex: 1,
  },
});

export default Index;

// FIRST FOR WED. ****************************************************
// !TODO: MAJOR - Pinch gesture should use focalX and focalY

// TODO: Links should attach to edge of circle and not the center

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
