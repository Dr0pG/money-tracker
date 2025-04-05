import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import Metrics from "@/constants/Metrics";
import Tabs from "@/components/Tabs";
import { BarChart } from "react-native-gifted-charts";
import AnimatedThemedView from "@/components/AnimatedThemedView";
import Transactions from "@/firebase/Transactions";
import { buildBarData } from "@/utils/Helpers";
import { useIsFocused } from "@react-navigation/native";
import { Transaction, TransactionType } from "@/store/walletStore";
import TransactionCard from "@/components/TransactionCard";
import LottieView from "lottie-react-native";
import { FlashList } from "@shopify/flash-list";
import userStore from "@/store/userStore";
import { useThemeColor } from "@/hooks/useThemeColor";

const TABS = ["statistics.weekly", "statistics.monthly", "statistics.yearly"];

export type BarChartData = {
  value: number;
  label?: string;
  spacing?: number;
  labelWidth?: number;
  labelTextStyle?: { color: string };
  frontColor?: string;
};

const Statistics = () => {
  const { t } = useTranslation();

  const isFocused = useIsFocused();

  const textColor = useThemeColor({}, "textPlaceholder");

  const { currency } = userStore();

  const scrollViewRef = useRef<ScrollView>(null);

  const [currentTab, setCurrentTab] = useState<number>(0);

  const [barChartData, setBarChartData] = useState<{
    weekly: { data: BarChartData[]; list: Transaction[] };
    monthly: { data: BarChartData[]; list: Transaction[] };
    yearly: { data: BarChartData[]; list: Transaction[] };
  } | null>(null);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactions = await Transactions.getTransactionsByRange();
        if (!transactions) return;

        const weeklyBarData = buildBarData(transactions.weekly, "weekly");
        const monthlyBarData = buildBarData(transactions.monthly, "monthly");
        const yearlyBarData = buildBarData(transactions.yearly, "yearly");

        setBarChartData({
          weekly: {
            data: weeklyBarData,
            list: Object.values(transactions.weekly).flat(),
          },
          monthly: {
            data: monthlyBarData,
            list: Object.values(transactions.monthly).flat(),
          },
          yearly: {
            data: yearlyBarData,
            list: Object.values(transactions.yearly).flat(),
          },
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    getTransactions();
  }, [isFocused]);

  useEffect(() => {
    scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, [currentTab]);

  const renderHeader = () => {
    return (
      <View style={styles.titleContainer}>
        <ThemedText type="bigTitle">{t("statistics.title")}</ThemedText>
      </View>
    );
  };

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

  const renderContent = useCallback(() => {
    let data = {
      chart: barChartData?.weekly.data,
      transactions: barChartData?.weekly.list,
    };
    if (currentTab === 1)
      data = {
        chart: barChartData?.monthly.data,
        transactions: barChartData?.monthly.list,
      };
    if (currentTab === 2)
      data = {
        chart: barChartData?.yearly.data,
        transactions: barChartData?.yearly.list,
      };

    return (
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Metrics.largePadding * 5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BarChart
          data={data.chart}
          barWidth={10}
          spacing={40}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisLabelWidth={40}
          yAxisTextStyle={{ color: textColor }}
          noOfSections={3}
          yAxisLabelPrefix={currency}
        />
        <View style={styles.transactionsContainer}>
          <ThemedText type="title" style={styles.title}>
            {t("transactions")}
          </ThemedText>
          <FlashList
            data={data.transactions}
            renderItem={({ item }) => {
              const { id, type, category, amount, date, description } =
                item as Transaction;
              return (
                <TransactionCard
                  key={id}
                  type={type}
                  category={category}
                  isIncome={type === TransactionType.Income}
                  value={amount}
                  date={date}
                  description={description}
                />
              );
            }}
            estimatedItemSize={20}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </ScrollView>
    );
  }, [barChartData, currentTab, textColor]);

  const renderTabs = () => {
    return (
      <AnimatedThemedView animationType="fade">
        <Tabs data={TABS} onChangeTab={setCurrentTab}>
          {renderContent()}
        </Tabs>
      </AnimatedThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
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
  transactionsContainer: {
    paddingVertical: Metrics.largePadding,
  },
  title: {
    fontSize: Metrics.size22,
    lineHeight: Metrics.size22 * 1.3,
    paddingBottom: Metrics.mediumPadding,
  },
});

export default memo(Statistics);
