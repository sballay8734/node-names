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
import { useAppDispatch } from "@/hooks/reduxHooks";
import { handlePopover } from "@/features/manageSelections/redux/manageSelections";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

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
              color={"#e0ae6c"}
              style={{
                position: "absolute",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                top: -25,
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
