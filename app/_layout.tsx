import { useFonts } from "expo-font";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  withLayoutContext,
} from "expo-router";
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

  const navigationRef = useNavigationContainerRef();

  const storeUser = userStore((state) => state.storeUser);

  useEffect(() => {
    if (navigationRef.current?.isReady()) {
      const subscriber = auth().onAuthStateChanged(
        (user: FirebaseAuthTypes.User | null) => {
          storeUser(user);

          if (user) {
            router.navigate("/(home)");
          } else {
            router.navigate("/(main)");
          }
        }
      );

      return () => {
        subscriber(); // unsubscribe on unmount
      };
    }
  }, [navigationRef]);

  useEffect(() => {
    setTimeout(
      () => setBackgroundColor(backgroundColor),
      Durations.colorChanged / 2
    );
  }, [backgroundColor]);

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
      <JsStack initialRouteName="(main)" screenOptions={{ headerShown: false }}>
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ThemedApp />
          <Toasts />
        </ThemeProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
