import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import Animated from "react-native-reanimated";

import { CustomThemeContext } from "@/components/CustomThemeContext";
import PlusIcon from "@/components/PlusIcon";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import AddNewBtn from "@/features/Graph/components/PlusButton";

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
                  borderRadius: 100,
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
              ]}
            >
              <PlusIcon color={theme.primary} size={44} />
            </Animated.View>
          ),

          tabBarButton: (props) => <AddNewBtn {...props} />,
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
