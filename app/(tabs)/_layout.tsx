import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Ionicons } from "@expo/vector-icons";

import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
            <Ionicons
              name="add-circle"
              size={72}
              color={color}
              style={{
                // paddingTop: 5,
                // marginBottom: "auto",
                position: "absolute",
                top: -20,
              }}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => alert("ADD STUFF")}
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

// TODO: Change add icon to skinnier plus sign
// TODO: Add glow to add btn
