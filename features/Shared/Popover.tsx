import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

import CPressable from "@/components/CustomNativeComponents/CPressable";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { createNewNode } from "../Graph/redux/graphManagement";
import { NodeHashObj } from "../Graph/utils/getInitialNodes";
import { usePopoverOptions } from "../SelectionManagement/utils/determineOptions";

const testNode: NodeHashObj = {
  isShown: true,
  x: 600.7020822980046,
  y: 335.2613025301253,
  id: 99,
  created_at: "2024-08-08T18:09:18.182221+00:00",
  first_name: "Johnny",
  last_name: "TEST",
  maiden_name: null,
  group_id: 4,
  sex: "male",
  phonetic_name: null,
  group_name: "Family",
  date_of_birth: null,
  date_of_death: null,
  gift_ideas: null,
  preferred_name: null,
  partner_details: null,
  depth_from_user: 1,
  children_details: [
    { child_id: 1, adoptive_parents_ids: [], biological_parents_ids: [24, 23] },
    {
      child_id: 25,
      adoptive_parents_ids: [],
      biological_parents_ids: [24, 23],
    },
    {
      child_id: 26,
      adoptive_parents_ids: [],
      biological_parents_ids: [24, 23],
    },
  ],
  parent_details: null,
  shallowest_ancestor: 1,
  is_current_root: false,
};

export default function Popover(): React.JSX.Element {
  const popoverOptions = usePopoverOptions();
  const dispatch = useDispatch();

  const isVisible = useAppSelector(
    (state: RootState) => state.selections.popoverIsShown,
  );

  const viewStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
    bottom: withTiming(isVisible ? 25 : 0, { duration: 200 }),
  }));

  type ActionMap = {
    [key: string]: () => void;
  };

  const actionMap: ActionMap = {
    "Create a new node": () => dispatch(createNewNode(testNode)),
    "Create a new group": () => console.log("Create new group"),
    "Connect to a new node": () => console.log("Connect to new node"),
    "Connect to a new group": () => console.log("Connect to new group"),
    "Connect selected nodes": () => console.log("Connect selected nodes"),
    "Create group from selection": () =>
      console.log("Create group from selection"),
    "ERROR: Can only connect root to a NEW node/group": () =>
      console.log("ERROR"),
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          // bottom: 25,
          right: 10,
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          backgroundColor: "transparent",
          height: "auto",
          zIndex: 1000,
          paddingVertical: 10,
          borderRadius: 5,
          gap: 8,
          // opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        },
        viewStyles,
      ]}
    >
      {popoverOptions.map((option) => {
        return (
          <CPressable
            onPress={actionMap[option.text]}
            key={option.text}
            icon={option.icon}
            containerStyles={{
              height: 44,
              backgroundColor: "grey",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 6,
              width: "100%",
              borderRadius: 100,
            }}
            textStyles={{ color: "black" }}
            text={option.text}
          />
        );
      })}
    </Animated.View>
  );
}
