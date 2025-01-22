import { useFonts } from "expo-font";
import { Stack, useRouter, withLayoutContext } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import i18n from "@/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Durations from "@/constants/Durations";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";
import { Toasts } from "@backpackapp-io/react-native-toast";
import userStore from "@/store/userStore";

import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const ThemedApp = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");

  const [currentBackground, setBackgroundColor] = useState(backgroundColor);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  const currentUser = userStore((state) => state.user);
  const storeUser = userStore((state) => state.storeUser);

  useEffect(() => {
    setTimeout(
      () => setBackgroundColor(backgroundColor),
      Durations.colorChanged / 2
    );
  }, [backgroundColor]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        storeUser(user);
        if (initializing) setInitializing(false);
      }
    );
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!initializing) {
      // Redirect to the appropriate screen based on user state
      if (currentUser) {
        // User is logged in, navigate to the home screen
        router.replace("/(home)");
      } else {
        // User is logged out, navigate to the main screen
        router.replace("/(main)");
      }
    }
  }, [currentUser, initializing, router]);

  // Ensure that we wait until Firebase has finished initializing before rendering
  if (initializing) {
    return <ActivityIndicator />; // You can replace this with a loading spinner or splash screen.
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentBackground }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        backgroundColor={backgroundColor}
        animated
      />
      <JsStack initialRouteName={!currentUser ? "(main)" : "(home)"}>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <JsStack.Screen
          name="(shared)/addTransaction"
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
        <JsStack.Screen
          name="(shared)/createWallet"
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </JsStack>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <>
            <ThemedApp />
            <Toasts />
          </>
        </ThemeProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
