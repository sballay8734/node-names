import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const ANON_KEY = process.env.EXPO_SUPABASE_ANON_KEY!;

const supabase = createClient(
  "https://zejdlrzibsdznpanwwot.supabase.co",
  ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
