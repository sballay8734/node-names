import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { handlePopover } from "./redux/manageSelections";

interface Props extends PressableProps {
  containerStyles?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddBtn({
  containerStyles,
  onPress,
  ...props
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#FFE04B" : "#B58DF1", {
      duration: 100,
    }),
  }));

  function handlePressIn() {
    isPressed.value = true;
    dispatch(handlePopover());
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  return (
    <AnimatedPressable
      {...props}
      onPress={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyles, animatedStyles]}
    >
      <View
        style={{
          backgroundColor: "#845fba",
          borderRadius: 100,
          padding: 5,
          borderWidth: 1,
        }}
      >
        <AntDesign name="plus" size={24} color="black" />
      </View>
    </AnimatedPressable>
  );
}
