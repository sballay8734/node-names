import {
  FontAwesome6,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

import { useCustomTheme } from "@/components/CustomThemeContext";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { handlePopover } from "@/features/SelectionManagement/redux/manageSelections";
import { useAppDispatch } from "@/hooks/reduxHooks";

export default function TabLayout() {
  const theme = useCustomTheme();
  const dispatch = useAppDispatch();

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
