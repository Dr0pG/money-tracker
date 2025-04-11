import React, { memo, useCallback, useEffect, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import FadeFlatList from "@/components/FadeFlatList";
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
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { EventEmitterHelper, EventName } from "@/utils/EventEmitter";

const WalletsTab = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const isFocused = useIsFocused();

  const { currency } = userStore();
  const {
    wallets,
    currentWalletId,
    setCurrentWallet,
    setCurrentWalletId,
    setWallets,
  } = walletStore();

  const [
    backgroundMiddle,
    addTransactionBackgroundColor,
    addTransactionIconColor,
  ] = useThemeColor({}, ["backgroundMiddle", "button", "buttonText"]);

  const [currentWalletsTotal, setCurrentWalletsTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const getWallets = async () => {
    try {
      setIsLoading(true);

      const wallets = await Wallets.getWallets();
      if (!wallets || !wallets?.length) return;

      setWallets(wallets);

      setCurrentWalletsTotal(totalWallets(wallets));

      return wallets;
    } catch (error) {
      Toast.showError(
        i18n.t("wallets.there_was_a_problem_getting_your_wallets")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFocused) return;

    getWallets();
  }, [isFocused]);

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

  const onSelectWallet = async (id: string) => {
    try {
      const currentSelected = await Wallets.selectCurrentWallet(id);
      if (!currentSelected) {
        throw new Error();
      }

      setCurrentWalletId(id);

      EventEmitterHelper.emit(EventName.UpdateTransactions);

      Toast.showError(i18n.t("wallets.wallet_selected_successfully"));
    } catch (error) {
      Toast.showError(
        i18n.t("wallets.there_was_a_problem_selecting_your_wallet")
      );
    }
  };

  const onDelete = async (id: string) => {
    try {
      const isDeletedWallet = await Wallets.deleteWallet(id);
      if (!isDeletedWallet) {
        throw new Error();
      }

      const currentWallets = await getWallets();

      const findCurrentWalletId = currentWallets?.some(
        (wallet) => wallet?.id === currentWalletId
      );

      if (!findCurrentWalletId && !!currentWallets?.[0]) {
        const firstWallet = currentWallets[0];

        const currentSelected = await Wallets.selectCurrentWallet(
          firstWallet.id
        );

        if (!currentSelected) {
          throw new Error();
        }

        setCurrentWallet(firstWallet);
        setCurrentWalletId(firstWallet.id);
      }

      EventEmitterHelper.emit(EventName.UpdateTransactions);

      Toast.showError(i18n.t("delete_wallet.wallet_deleted_successfully"));
    } catch (error) {
      Toast.showError(
        i18n.t("delete_wallet.there_was_a_problem_deleting_your_wallets")
      );
    }
  };

  const onDeleteWallet = (id: string) => {
    Alert.alert(
      t("delete_wallet.delete_wallet"),
      t("delete_wallet.do_you_wanna_delete_this_wallet"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("ok").toUpperCase(),
          onPress: () => onDelete(id),
        },
      ]
    );
  };

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
          extraData={currentWalletId}
          contentContainerStyle={styles.walletsListContainer}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const { id, name, image, income, expense } = item as Wallet;
            return (
              <WalletCard
                key={id}
                id={id}
                name={name}
                image={image}
                isSelected={currentWalletId === id}
                total={subtractNumbers(income ?? 0, expense ?? 0)}
                onEdit={() => onNavigateToWallet(item as Wallet)}
                onSelect={onSelectWallet}
                onDelete={onDeleteWallet}
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
  }, [wallets, currentWalletId]);

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
