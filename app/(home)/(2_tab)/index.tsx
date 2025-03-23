import React, { memo, useCallback, useEffect, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Loader from "@/components/Loader";
import ThemedText from "@/components/ThemedText";
import Toast from "@/components/Toast";
import Metrics from "@/constants/Metrics";
import Wallets from "@/firebase/Wallets";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import userStore from "@/store/userStore";
import walletStore from "@/store/walletStore";
import { formatEuropeanNumber } from "@/utils/Helpers";
import { totalWallets } from "@/utils/TransationsHelper";

const WalletsTab = () => {
  const { t } = useTranslation();

  const { currency } = userStore();
  const { wallets, setWallets } = walletStore();

  const backgroundMiddle = useThemeColor({}, "backgroundMiddle");

  const [currentWalletsTotal, setCurrentWalletsTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWallets = async () => {
      try {
        setIsLoading(true);

        const wallets = await Wallets.getWallets();
        if (!wallets?.length) return;

        setWallets(wallets);

        setCurrentWalletsTotal(totalWallets(wallets));
      } catch (error) {
        Toast.showError(
          i18n.t("wallets.there_was_a_problem_getting_your_wallets")
        );
      } finally {
        setIsLoading(false);
      }
    };

    getWallets();
  }, []);

  const renderTotal = useCallback(() => {
    return (
      <View style={styles.topContainer}>
        <ThemedText
          type="walletTotal"
          style={styles.totalText}
        >{`${formatEuropeanNumber(currentWalletsTotal) + currency}`}</ThemedText>
        <ThemedText>{t("wallets.total_balance")}</ThemedText>
      </View>
    );
  }, [wallets, currentWalletsTotal]);

  const renderWallets = useCallback(() => {
    return (
      <View
        style={[styles.walletsContainer, { backgroundColor: backgroundMiddle }]}
      >
        <ThemedText type="subtitle">{t("wallets.my_wallets")}</ThemedText>
      </View>
    );
  }, [wallets]);

  if (isLoading) return <Loader />;

  return (
    <ThemedView style={styles.container}>
      {renderTotal()}
      {renderWallets()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.mediumPadding,
  },
  topContainer: {
    paddingVertical: Metrics.largePadding * 3,
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: {
    paddingBottom: Metrics.smallPadding,
  },
  walletsContainer: {
    flex: 1,
    paddingVertical: Metrics.mediumPadding * 2,
    paddingHorizontal: Metrics.largePadding,
    borderTopRightRadius: Metrics.largeRadius * 2,
    borderTopLeftRadius: Metrics.largeRadius * 2,
  },
});

export default memo(WalletsTab);
