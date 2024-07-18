import { Pressable, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { View, Text } from "@/components/Themed";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  icon?: React.ReactNode | boolean;
  text?: string;
  containerStyles?: ViewStyle;
  textStyles?: TextStyle;
  handleCenter: () => void;
}

export default function RecenterBtn({
  icon,
  text,
  containerStyles,
  textStyles,
  handleCenter,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#FFE04B" : "#B58DF1", {
      duration: 100,
    }),
  }));

  function handlePressIn() {
    isPressed.value = true;
    handleCenter();
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bottom: 10,
          left: 10,
          height: 50,
          width: 50,
          borderRadius: 100,
          backgroundColor: "green",
        },
        animatedStyles,
      ]}
    >
      <Text style={{ ...textStyles, color: "black", fontSize: 20 }}>^</Text>
    </AnimatedPressable>
  );
}
