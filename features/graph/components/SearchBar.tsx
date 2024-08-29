import { Fontisto } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const AnimatedIcon = Animated.createAnimatedComponent(Fontisto);

const BORDER_COLOR = "#333333";

export default function SearchBar(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const isPressed = useSharedValue<boolean>(false);
  const inputIsShown = useSharedValue<boolean>(false);

  const handlePressIn = () => {
    isPressed.value = true;
    inputIsShown.value = !inputIsShown.value;
  };

  const handlePressOut = () => {
    isPressed.value = false;
  };

  const animatedInputStyles = useAnimatedStyle(() => ({
    flex: withTiming(inputIsShown.value ? 1 : 0, {
      duration: 200,
    }),
    opacity: withTiming(inputIsShown.value ? 1 : 0, {
      duration: 200,
    }),
    pointerEvents: inputIsShown.value ? "auto" : "none",
    borderColor: inputIsShown.value ? BORDER_COLOR : "transparent",
  }));

  const animatedIconProps = useAnimatedProps(() => ({
    color: withTiming(isPressed.value ? "red" : "white", {
      duration: 200,
    }),
  }));

  // TODO: Left border should not go full height
  const animatedPressableProps = useAnimatedProps(() => ({
    borderLeftColor: withTiming(
      inputIsShown.value ? BORDER_COLOR : "transparent",
      {
        duration: 200,
      },
    ),
  }));

  return (
    <Animated.View style={[styles.container, { marginTop: insets.top + 10 }]}>
      <Animated.View style={[styles.wrapper]}>
        <AnimatedInput style={[styles.input, animatedInputStyles]} />
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.pressable, animatedPressableProps]}
        >
          <AnimatedIcon
            animatedProps={animatedIconProps}
            name="search"
            size={20}
          />
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    pointerEvents: "box-none",
  },
  wrapper: {
    backgroundColor: "transparent",
    position: "relative",
    minHeight: 60,
    borderRadius: 4,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    pointerEvents: "box-none",
  },
  input: {
    display: "flex",
    backgroundColor: "rgba(0,0,0,0.4)",
    height: "100%",
    paddingHorizontal: 10,
    color: "white",
    borderWidth: 1,
    borderRadius: 4,
  },
  pressable: {
    // backgroundColor: "transparent",
    pointerEvents: "auto",
    position: "absolute",
    right: 0,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignSelf: "flex-start",
    padding: 10,
    paddingHorizontal: 20,
    borderLeftWidth: 1,
  },
});

// !TODO: Blur input bg
// !TODO: Input should be focused on press
// !TODO: Close input on outside click
