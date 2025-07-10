import React, { memo, useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import RecentTransactions from "@/components/Home/RecentTransactions";
import Loader from "@/components/Loader";
import MainCard from "@/components/MainCard";
import TouchableOpacity from "@/components/TouchableOpacity";
import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import User from "@/firebase/User";
import Wallets from "@/firebase/Wallets";
import { useThemeColor } from "@/hooks/useThemeColor";
import userStore, { UserInfo } from "@/store/userStore";
import walletStore, { Wallet } from "@/store/walletStore";
import { EventEmitterHelper, EventName } from "@/utils/EventEmitter";
import Ionicons from "@expo/vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const Home = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onNavigateToAddTransaction = () =>
    router.navigate("../(shared)/addTransaction");
  const onNavigateToCreateAccount = () =>
    router.navigate("../(shared)/createWallet");
  const onNavigateToSearchTransaction = () =>
    router.navigate("../(shared)/searchTransaction");

  const { currentWallet, setCurrentWalletId, setCurrentWallet, setWallets } =
    walletStore();

  const currentUser = userStore((state) => state.user);

  const storeUser = userStore((state) => state.storeUser);
  const storeUserInfo = userStore((state) => state.storeUserInfo);

  const [
    iconColor,
    addTransactionIconColor,
    addTransactionBackgroundColor,
    iconBackgroundColor,
  ] = useThemeColor({}, [
    "icon",
    "buttonText",
    "button",
    "backButtonBackground",
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const getInfo = async () => {
        const getFulfilledValue = (result: any) =>
          result.status === "fulfilled" ? result.value : undefined;

        try {
          const [
            walletsResult,
            currentWalletResult,
            currentWalletIdResult,
            userInfoResult,
          ] = await Promise.allSettled([
            Wallets.getWallets(),
            Wallets.getCurrentWallet(),
            Wallets.getCurrentWalletId(),
            User.getUserInfo(),
          ]);

          // Wallets
          const wallets = getFulfilledValue(walletsResult) as
            | Wallet[]
            | undefined;
          setWallets(wallets ?? null);

          // Current Wallet
          let currentWallet = getFulfilledValue(currentWalletResult) as
            | Wallet
            | undefined;
          if (!currentWallet && wallets && wallets.length > 0) {
            currentWallet = wallets[0];
          }
          setCurrentWallet(currentWallet ?? null);

          // Current Wallet ID
          let currentWalletId = getFulfilledValue(currentWalletIdResult) as
            | string
            | undefined;
          if (!currentWalletId && wallets && wallets.length > 0) {
            currentWalletId = wallets[0].id;
          }
          setCurrentWalletId(currentWalletId ?? null);

          // User Info
          const userInfo = getFulfilledValue(userInfoResult) as
            | UserInfo
            | undefined;
          if (userInfo) {
            const user = auth().currentUser;
            storeUserInfo(userInfo);
            if (user) storeUser({ ...user, displayName: userInfo?.name || "" });
          }
        } catch (error: any) {
          console.log("Home error: ", error.message);
        } finally {
          setIsLoading(false);
        }
      };

      getInfo();

      const subscription = EventEmitterHelper.listen(
        EventName.UpdateTransactions,
        () => {
          getInfo();
        }
      );

      return () => {
        EventEmitterHelper.remove(subscription);
      };
    }, [])
  );

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <ThemedText type="gray" style={styles.helloText}>
            {t("home.hello")}
          </ThemedText>
          <ThemedText type="bigTitle" numberOfLines={1} ellipsizeMode="tail">
            {currentUser?.displayName}
          </ThemedText>
        </View>
        {currentWallet && (
          <View style={styles.searchIconContainer}>
            <TouchableOpacity
              style={[
                styles.searchIconContent,
                { backgroundColor: iconBackgroundColor },
              ]}
              onPress={onNavigateToSearchTransaction}
            >
              <Ionicons
                name="search"
                size={Metrics.searchIcon}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderMainContent = () => {
    if (!currentWallet) {
      return (
        <>
          <LottieView
            source={require("@/assets/lottie/no_account.json")}
            style={styles.animationContent}
            autoPlay
            loop
          />
          <ThemedText type="gray" style={styles.noAccountText}>
            {t("home.no_wallet")}
          </ThemedText>
          <Button
            text={t("home.create_wallet")}
            onPress={onNavigateToCreateAccount}
          />
        </>
      );
    }

    return (
      <>
        <MainCard
          title={currentWallet?.name}
          income={currentWallet?.income}
          expense={currentWallet?.expense}
        />
        <View style={styles.recentTransactionsContainer}>
          <RecentTransactions title={t("home.recent_transactions")} />
        </View>
      </>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={[
          !currentWallet
            ? styles.mainContentEmptyContainer
            : styles.mainContentContainer,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={!!currentWallet}
      >
        {renderMainContent()}
      </ScrollView>
    );
  };

  const renderAddTransaction = () => {
    return (
      <Animated.View
        style={styles.addTransactionContainer}
        entering={FadeInDown.duration(Durations.animations)
          .delay(Durations.animationsDelay)
          .springify()}
        exiting={FadeOutDown.duration(Durations.animations)
          .delay(Durations.animationsDelay)
          .springify()}
      >
        <TouchableOpacity
          style={[
            styles.addTransactionContent,
            { backgroundColor: addTransactionBackgroundColor },
          ]}
          onPress={onNavigateToAddTransaction}
        >
          <AntDesign
            name="plus"
            size={Metrics.addTransactionIcon}
            color={addTransactionIconColor}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {currentWallet && renderAddTransaction()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding,
  },
  helloText: {
    paddingVertical: Metrics.smallPadding,
    fontSize: Metrics.size22,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Metrics.smallPadding,
  },
  nameContainer: {
    flex: 1,
  },
  searchIconContainer: {
    alignItems: "flex-end",
    marginLeft: Metrics.mediumMargin,
  },
  searchIconContent: {
    width: Metrics.searchButtonSize,
    height: Metrics.searchButtonSize,
    borderRadius: Metrics.searchButtonSize,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContentEmptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom:
      Metrics.largePadding +
      Metrics.addTransactionButton +
      Metrics.mediumPadding,
  },
  mainContentContainer: {
    marginTop: Metrics.mediumMargin,
    paddingBottom:
      Metrics.largePadding +
      Metrics.addTransactionButton +
      Metrics.mediumPadding,
  },
  recentTransactionsContainer: {
    marginTop: Metrics.largeMargin,
  },
  addTransactionContainer: {
    position: "absolute",
    bottom: Metrics.largePadding,
    right: Metrics.largePadding,
    alignItems: "center",
    justifyContent: "center",
  },
  addTransactionContent: {
    width: Metrics.addTransactionButton,
    height: Metrics.addTransactionButton,
    borderRadius: Metrics.addTransactionButton,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContent: {
    width: "100%",
    height: "60%",
  },
  noAccountText: {
    textAlign: "center",
    paddingBottom: Metrics.largePadding,
    fontSize: Metrics.size18,
    lineHeight: Metrics.size18 * 1.3,
  },
});

export default memo(Home);
