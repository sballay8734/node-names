import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import PlusIcon from "@/components/PlusIcon";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { handlePopover } from "@/features/Graph/redux/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { RootState } from "@/store/store";

export default function TabLayout() {
  const theme = useContext(CustomThemeContext);
  const dispatch = useAppDispatch();
  const sheetIsShown = useAppSelector(
    (state: RootState) => state.ui.sheetIsShown,
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(sheetIsShown ? 0 : 1, { duration: 150 }),
      pointerEvents: sheetIsShown ? "none" : "auto",
    };
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabBarActiveTint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.bgBase, // tab bar background
          overflow: "visible",
          paddingTop: 0,
          paddingBottom: 0,
          borderTopColor: theme.borderBase,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Tab One",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="graph-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="heart-outlined" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: -30 }],
                  // top: -30,
                  borderRadius: 100,
                  // pointerEvents: "none",
                  borderWidth: 1,
                  // borderColor: theme.primary,
                  borderColor: "red",
                  backgroundColor: theme.btnBaseSelected,
                  padding: 12,
                  // shadowColor: theme.primary,
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 0,
                  // },
                  // shadowOpacity: 0.35,
                  // shadowRadius: 6.0,

                  // elevation: 24,
                },
                animatedStyles,
              ]}
            >
              <PlusIcon color={theme.primary} size={44} />
            </Animated.View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.8}
              onPress={() => dispatch(handlePopover())}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Tab Three",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="heart-outlined" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Tab Four",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// !TODO: need to load assets (imgs) at build time
// TODO: transition the color of the btn
// TODO: Change add icon to skinnier plus sign
// TODO: Add glow to add btn
