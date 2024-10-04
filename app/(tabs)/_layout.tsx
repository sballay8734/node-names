import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import PlusButton from "@/features/Graph/components/PlusButton";

export default function TabLayout() {
  const theme = useContext(CustomThemeContext);

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
            <Entypo name="key" size={24} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          headerShown: false,

          tabBarButton: (props) => <PlusButton {...props} />,
        }}
      /> */}
      <Tabs.Screen
        name="three"
        options={{
          title: "Tab Three",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="text" size={24} color={color} />
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
