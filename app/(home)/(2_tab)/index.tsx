import React, { memo, useCallback, useEffect, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";

const WalletsTab = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const isFocused = useIsFocused();

  const onNavigateToWallet = (wallet?: Wallet) => {
    if (!wallet) {
      router.navigate("../(shared)/createWallet");
    } else {
      router.push({
        pathname: "/(shared)/createWallet",
        params: { wallet: JSON.stringify(wallet) },
      });
    }
  };

  const { currency } = userStore();
  const { wallets, setWallets } = walletStore();

  const backgroundMiddle = useThemeColor({}, "backgroundMiddle");
  const addTransactionBackgroundColor = useThemeColor({}, "button");
  const addTransactionIconColor = useThemeColor({}, "buttonText");

  const [currentWalletsTotal, setCurrentWalletsTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

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
  }, [isFocused]);

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
        <View style={styles.walletsAddContainer}>
          <ThemedText type="subtitle">{t("wallets.my_wallets")}</ThemedText>
          <TouchableOpacity
            onPress={() => onNavigateToWallet()}
            style={[
              styles.createWallet,
              { backgroundColor: addTransactionBackgroundColor },
            ]}
          >
            <AntDesign
              name="plus"
              size={Metrics.createWalletIcon}
              color={addTransactionIconColor}
            />
          </TouchableOpacity>
        </View>
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
                onPress={() => onNavigateToWallet(item as Wallet)}
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

  return (
    <ThemedView style={styles.container}>
      {renderTotal()}
      {renderWallets()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Metrics.mediumPadding },
  topContainer: {
    paddingVertical: Metrics.largePadding * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: { paddingBottom: Metrics.smallPadding },
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
  animationContent: { width: "60%", height: "60%" },
  emptyText: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
    paddingBottom: Metrics.mediumPadding,
  },
  walletsListContainer: { paddingVertical: Metrics.largePadding },
  walletsAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createWallet: {
    width: Metrics.createWalletButton,
    height: Metrics.createWalletButton,
    borderRadius: Metrics.createWalletButton,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(WalletsTab);
