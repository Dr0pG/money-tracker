import React, { memo, useCallback, useState } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import Metrics from "@/constants/Metrics";
import Tabs from "@/components/Tabs";
import { BarChart } from "react-native-gifted-charts";

const TABS = ["statistics.weekly", "statistics.monthly", "statistics.yearly"];

const barData = [
  {
    value: 40,
    label: "Jan",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 20, frontColor: "#ED6665" },
  {
    value: 50,
    label: "Feb",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 40, frontColor: "#ED6665" },
  {
    value: 75,
    label: "Mar",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 25, frontColor: "#ED6665" },
  {
    value: 30,
    label: "Apr",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 20, frontColor: "#ED6665" },
  {
    value: 60,
    label: "May",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 40, frontColor: "#ED6665" },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 25,
    labelTextStyle: { color: "gray" },
    frontColor: "#177AD5",
  },
  { value: 30, frontColor: "#ED6665" },
];

const Statistics = () => {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState<number>(0);

  const renderHeader = () => {
    return (
      <View style={styles.titleContainer}>
        <ThemedText type="bigTitle">{t("statistics.title")}</ThemedText>
      </View>
    );
  };

  const renderContent = useCallback(() => {
    if (currentTab === 0) {
      return (
        <BarChart
          data={barData}
          barWidth={7}
          spacing={25}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: "gray" }}
          noOfSections={3}
          maxValue={75}
        />
      );
    }
    if (currentTab === 1) {
      return <ThemedText>{t("statistics.monthly")}</ThemedText>;
    }
    if (currentTab === 2) {
      return <ThemedText>{t("statistics.yearly")}</ThemedText>;
    }
  }, [currentTab]);

  const renderTabs = () => {
    return (
      <Tabs data={TABS} onChangeTab={setCurrentTab}>
        {renderContent()}
      </Tabs>
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
});

export default memo(Statistics);
