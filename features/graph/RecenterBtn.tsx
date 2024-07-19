import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { View } from "@/components/Themed";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  handleCenter: () => void;
  rootNodePos: { x: number; y: number };
  animatedProps: {
    translateX: number;
    translateY: number;
    scale: number;
  };
}

export default function RecenterBtn({
  handleCenter,
  rootNodePos,
  animatedProps,
}: Props): React.JSX.Element {
  const isPressed = useSharedValue<boolean>(false);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPressed.value ? "#FFE04B" : "#B58DF1", {
      duration: 100,
    }),
  }));

  const arrowStyle = useAnimatedStyle(() => {
    const { translateX = 0, translateY = 0, scale = 1 } = animatedProps;
    const dx = rootNodePos.x - -translateX / scale;
    const dy = rootNodePos.y - -translateY / scale;
    const angle = Math.atan2(dy, dx);

    return {
      transform: [{ rotate: `${angle}rad` }],
    };
  });

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
      <View style={styles.buttonContent}>
        <Animated.View style={[styles.arrow, arrowStyle]}>
          <FontAwesome5 name="location-arrow" size={18} color="black" />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
