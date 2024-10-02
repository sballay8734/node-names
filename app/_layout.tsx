import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { CustomThemeProvider } from "@/components/CustomThemeContext";
import AuthFlow from "@/features/Auth/AuthFlow";
import { store } from "@/store/store";
import AppLoading from "@/components/AppLoading";

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
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    SFNSMono: require("../assets/fonts/SFNSMono.ttf"),
    SFNSRounded: require("../assets/fonts/SFNSRounded.ttf"),
    // ...FontAwesome.font,
  });

  console.log(loaded, error);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <AppLoading />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();  // detects light or dark mode
  return (
    <CustomThemeProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={[styles.container]}>
          <AuthFlow />
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
    fontFamily: "Montserrat",
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
