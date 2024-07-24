import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import CPressable from "@/components/CustomNativeComponents/CPressable";
import { View } from "@/components/Themed";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

import { usePopoverOptions } from "./utils/determineOptions";

export default function Popover(): React.JSX.Element {
  const popoverOptions = usePopoverOptions();

  const isVisible = useAppSelector(
    (state: RootState) => state.selections.popoverIsShown,
  );

  const viewStyles = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 1 : 0, { duration: 150 }),
    bottom: withTiming(isVisible ? 25 : 0, { duration: 150 }),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          // bottom: 25,
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
