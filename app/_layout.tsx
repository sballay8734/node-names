import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ImageBackground, StyleSheet, Image } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { View } from "@/components/Themed";

// !TODO: need to load assets at build time
const image = {
  uri: "https://w0.peakpx.com/wallpaper/13/889/HD-wallpaper-space-light-dark-deep-galaxy.jpg",
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <ImageBackground
            source={image}
            style={styles.image}
            // background image opacity
            imageStyle={{ opacity: 0.2 }}
          >
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </ImageBackground>
        </View>
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
  },
});

// REMEMBER: MOST D3 modules (like d3-scale, d3-array, d3-interpolate, and d3-format) DON'T interact with the DOM

// REMEMBER: Some DO though. d3-selection, d3-transition, and d3-axis do manipulate the DOM, which competes with React’s virtual DOM. In these cases, you can attach a ref to an element and pass it to D3 in a useEffect hook.

// DOCS: https://d3js.org/getting-started#d3-in-react

// !TODO: USE D3 for the MATH side of things!

// !TODO: You should be able to create everything you need with Skia. But D3 should help alot with the math

// TODO: Make sure to also include ability to add photos, description, social media links, phone, email, etc... "John's friends boyfriend. Remember him? Can't remember blah blah blah..." -- You'd never find that person in contacts but could use NodeNames to find them pretty easily.

// TODO: Do you add the ability for people to create their own relationships and then people can just import them IF THEY CHOOSE?

// TODO: Set up ESLINT
