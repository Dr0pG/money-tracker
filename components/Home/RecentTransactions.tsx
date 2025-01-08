import { StyleSheet, View } from "react-native";
import React from "react";
import ThemedText from "@/components/ThemedText";
import Metrics from "@/constants/Metrics";
import FadeFlatList from "@/components/FadeFlatList";
import TransactionCard from "@/components/TransactionCard";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const TEMP = [
  {
    id: 1,
    type: "health",
    description: "Checkup fee",
    isIncome: false,
    value: 30,
    date: new Date("26-11-2024"),
  },
  {
    id: 2,
    type: "income",
    description: "Random money",
    isIncome: true,
    value: 20,
    date: new Date("26-11-2024"),
  },
  {
    id: 3,
    type: "utilities",
    description: "Electricity bill",
    isIncome: false,
    value: 50,
    date: new Date("2024-12-01"),
  },
  {
    id: 4,
    type: "dining",
    description: "Dinner at a restaurant",
    isIncome: false,
    value: 45,
    date: new Date("2024-12-02"),
  },
  {
    id: 5,
    type: "income",
    description: "Freelance project payment",
    isIncome: true,
    value: 200,
    date: new Date("2024-12-03"),
  },
  {
    id: 6,
    type: "clothing",
    description: "New shoes",
    isIncome: false,
    value: 70,
    date: new Date("2024-12-04"),
  },
  {
    id: 7,
    type: "groceries",
    description: "Weekly groceries",
    isIncome: false,
    value: 80,
    date: new Date("2024-12-05"),
  },
  {
    id: 8,
    type: "sports",
    description: "Gym membership renewal",
    isIncome: false,
    value: 60,
    date: new Date("2024-12-06"),
  },
  {
    id: 9,
    type: "health",
    description: "Pharmacy expenses",
    isIncome: false,
    value: 25,
    date: new Date("2024-12-07"),
  },
  {
    id: 10,
    type: "income",
    description: "Gift from a friend",
    isIncome: true,
    value: 100000,
    date: new Date("2024-12-08"),
  },
  {
    id: 11,
    type: "utilities",
    description: "Water bill",
    isIncome: false,
    value: 35,
    date: new Date("2024-12-09"),
  },
  {
    id: 12,
    type: "dining",
    description: "Coffee and snacks",
    isIncome: false,
    value: 15,
    date: new Date("2024-12-10"),
  },
];

const RecentTransactions = () => {
  const { t } = useTranslation();

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require("@/assets/lottie/empty_state.json")}
          style={styles.animationContent}
          autoPlay
          loop
        />
        <ThemedText type="gray" style={styles.emptyText}>
          {t("home.no_transactions_yet")}
        </ThemedText>
      </View>
    );
  };

  return (
    <View>
      <ThemedText type="title" style={styles.title}>
        {t("home.recent_transactions")}
      </ThemedText>
      <FadeFlatList
        data={[]}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TransactionCard
            key={item.id}
            type={item.type}
            description={item.description}
            isIncome={item.isIncome}
            value={item.value}
            date={item.date}
          />
        )}
        keyExtractor={(item) => item?.id}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: Metrics.size22,
    lineHeight: Metrics.size22 * 1.3,
    paddingBottom: Metrics.mediumPadding,
  },
  itemSeparator: {
    height: Metrics.mediumPadding,
  },
  emptyContainer: {
    flex: 1,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContent: {
    width: "60%",
    height: "60%",
  },
  emptyText: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
    paddingBottom: Metrics.mediumPadding,
  },
});

export default RecentTransactions;
