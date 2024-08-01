import { Pressable, TextStyle, ViewStyle, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  icon?: React.ReactNode | boolean;
  text?: string;
  containerStyles?: ViewStyle;
  textStyles?: TextStyle;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CPressable({
  icon,
  text,
  containerStyles,
  textStyles,
  onPress,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#7448b5" : "#B58DF1", {
      duration: 200,
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
      onPress={onPress}
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
