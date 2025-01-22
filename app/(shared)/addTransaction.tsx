import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import Back from "@/components/Back";

const AddTransaction = () => {
  const router = useRouter();

  const onBack = () => router.back();

  return (
    <ThemedView style={styles.container}>
      <View>
        <Back onPress={onBack} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.largePadding,
  },
});

export default AddTransaction;
