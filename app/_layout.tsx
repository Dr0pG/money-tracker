import { LogBox } from "react-native";

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
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import Durations from "@/constants/Durations";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import userStore from "@/store/userStore";
import { Toasts } from "@backpackapp-io/react-native-toast";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

import Settings from "@/firebase/Settings";
import settingsStore from "@/store/settingsStore";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import messaging from "@react-native-firebase/messaging";
import Notifications from "@/services/Notifications";

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Handle background messages using setBackgroundMessageHandler
messaging().setBackgroundMessageHandler(Notifications.displayNotification);

const ThemedApp = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");

  const [currentBackground, setBackgroundColor] = useState(backgroundColor);

  const navigationRef = useNavigationContainerRef();

  const storeUser = userStore((state) => state.storeUser);

  const storeSettings = settingsStore((state) => state.storeSettings);

  useEffect(() => {
    if (navigationRef.current?.isReady()) {
      const subscriber = auth().onAuthStateChanged(
        (user: FirebaseAuthTypes.User | null) => {
          storeUser(user);

          if (user) {
            router.replace("/(home)");
          } else {
            router.replace("/(main)");
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

  useEffect(() => {
    const getCurrentSettings = async () => {
      try {
        const settings = await Settings.getSettings();
        storeSettings(settings);
      } catch (error: any) {
        console.log("Settings error: ", error.message);
      }
    };

    getCurrentSettings();
  }, []);

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
        <JsStack.Screen
          name="(shared)/searchTransaction"
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
        <JsStack.Screen
          name="(shared)/editProfile"
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
        <JsStack.Screen
          name="(shared)/settings"
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
        <JsStack.Screen
          name="(shared)/privacyPolicy"
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
