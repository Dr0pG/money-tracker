import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";

const AddTransaction = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>create_transaction</ThemedText>
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
