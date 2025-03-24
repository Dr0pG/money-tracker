import React, { memo, useCallback, useEffect, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import FadeFlatList from "@/components/FadeFlatList";
import Loader from "@/components/Loader";
import ThemedText from "@/components/ThemedText";
import Toast from "@/components/Toast";
import WalletCard from "@/components/WalletCard";
import Metrics from "@/constants/Metrics";
import Wallets from "@/firebase/Wallets";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import userStore from "@/store/userStore";
import walletStore, { Wallet } from "@/store/walletStore";
import { formatEuropeanNumber, subtractNumbers } from "@/utils/Helpers";
import { totalWallets } from "@/utils/TransactionsHelper";
import LottieView from "lottie-react-native";

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
        if (!wallets || !wallets?.length) return;

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
          {t("wallets.no_wallets_yet")}
        </ThemedText>
      </View>
    );
  };

  const renderWallets = useCallback(() => {
    return (
      <View
        style={[styles.walletsContainer, { backgroundColor: backgroundMiddle }]}
      >
        <ThemedText type="subtitle">{t("wallets.my_wallets")}</ThemedText>
        <FadeFlatList
          data={wallets}
          contentContainerStyle={styles.walletsListContainer}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const { id, name, image, income, expense } = item as Wallet;
            return (
              <WalletCard
                key={id}
                name={name}
                image={image}
                total={subtractNumbers(income ?? 0, expense ?? 0)}
              />
            );
          }}
          keyExtractor={(item) => {
            const transaction = item as Wallet;
            return transaction?.id;
          }}
          ListEmptyComponent={ListEmptyComponent}
        />
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
    paddingVertical: Metrics.largePadding * 2,
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
  walletsListContainer: {
    paddingVertical: Metrics.largePadding,
  },
});

export default memo(WalletsTab);
