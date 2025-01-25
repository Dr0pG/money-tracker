import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";

const Loader = () => {
  return (
    <ThemedView style={styles.mainContent}>
      <LottieView
        source={require("@/assets/lottie/loader.json")}
        style={styles.content}
        autoPlay
        loop
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "25%",
    height: "25%",
  },
});

export default Loader;
