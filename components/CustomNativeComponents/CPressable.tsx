import { Pressable, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text, View } from "../Themed";

interface Props {
  icon?: React.ReactNode | boolean;
  text?: string;
  containerStyles?: ViewStyle;
  textStyles?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CPressable({
  icon,
  text,
  containerStyles,
  textStyles,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#FFE04B" : "#B58DF1", {
      duration: 100,
    }),
  }));

  function handlePressIn() {
    isPressed.value = true;
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyles, animatedStyles]}
    >
      {icon && (
        <View
          style={{
            backgroundColor: "#845fba",
            borderRadius: 100,
            padding: 5,
            borderWidth: 1,
          }}
        >
          {icon}
        </View>
      )}
      <Text style={textStyles}>{text}</Text>
    </AnimatedPressable>
  );
}
