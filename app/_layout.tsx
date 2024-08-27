import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { CustomThemeProvider } from "@/components/CustomThemeContext";
import { store } from "@/store/store";
import { supabase } from "@/supabase";

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

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          username: username,
          sex: "male",
        },
      },
    });

    if (error) Alert.alert(error.message);
    // if (!session)
    //   Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.authContainer}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Firstname"
          leftIcon={{ type: "font-awesome" }}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          secureTextEntry={false}
          placeholder="Firstname"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          leftIcon={{ type: "font-awesome" }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          secureTextEntry={false}
          placeholder="Username"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();  // detects light or dark mode
  return (
    <CustomThemeProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={[styles.container]}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              backgroundColor: "transparent",
            }}
          >
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  // contentStyle: { backgroundColor: "#0c0b0d" },
                }}
              />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </View>
        </GestureHandlerRootView>
      </Provider>
    </CustomThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  image: {
    flex: 1,
    // height: 1000,
    // width: 1000,
    // resizeMode: "contain",
    justifyContent: "center",
    backgroundColor: "black",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  authContainer: {
    flex: 1,
    padding: 12,
    flexDirection: "column",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
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

/*
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  first_name text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

create policy "Users can delete own profile." on profiles
  for delete using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, username)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

*/
