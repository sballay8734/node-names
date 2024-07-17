import React from "react";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FontAwesome6 } from "@expo/vector-icons";

import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { handlePopover } from "@/features/manageSelections/redux/manageSelections";
import { RootState } from "@/store/store";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          overflow: "visible",
          paddingTop: 0,
          paddingBottom: 0,
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
          tabBarIcon: ({ color }) => (
            <Entypo name="heart-outlined" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="circle-plus"
              size={72}
              color={selectedNodes.length === 0 ? "#382a1c" : "#e0ae6c"}
              style={{
                position: "absolute",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                top: -20,
              }}
            />
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
                pointerEvents: selectedNodes.length === 0 ? "none" : "auto",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Tab Three",
          tabBarIcon: ({ color }) => (
            <Entypo name="heart-outlined" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Tab Four",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// TODO: transition the color of the btn
// TODO: Change add icon to skinnier plus sign
// TODO: Add glow to add btn
