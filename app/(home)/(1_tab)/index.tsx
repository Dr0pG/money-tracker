import React, { memo, useEffect, useState } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import RecentTransactions from "@/components/Home/RecentTransactions";
import MainCard from "@/components/MainCard";
import TouchableOpacity from "@/components/TouchableOpacity";
import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import userStore from "@/store/userStore";
import walletStore from "@/store/walletStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Wallets from "@/firebase/Wallets";
import User from "@/firebase/User";
import Loader from "@/components/Loader";
import auth from "@react-native-firebase/auth";

const Home = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { currentWallet, setCurrentWallet } = walletStore();

  const onNavigateToAddTransaction = () =>
    router.navigate("../(shared)/addTransaction");
  const onNavigateToCreateAccount = () =>
    router.navigate("../(shared)/createWallet");

  const currentUser = userStore((state) => state.user);

  const storeUser = userStore((state) => state.storeUser);
  const setCurrency = userStore((state) => state.setCurrency);

  const iconColor = useThemeColor({}, "icon");

  const addTransactionIconColor = useThemeColor({}, "buttonText");
  const addTransactionBackgroundColor = useThemeColor({}, "button");

  const iconBackgroundColor = useThemeColor({}, "backButtonBackground");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const user = auth().currentUser;
        if (user) storeUser(user);

        const responseCurrentWallet: string | null =
          await Wallets.getCurrentWallet();

        if (!responseCurrentWallet && !!currentWallet) setCurrentWallet();

        if (responseCurrentWallet !== currentWallet)
          setCurrentWallet(responseCurrentWallet);

        const currency = await User.getUserCurrency();
        if (currency) setCurrency(currency);
      } catch (error: any) {
        console.log("Home error: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInfo();
  }, []);

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
              onPress={() => console.log("oi")}
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
    if (!currentWallet)
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

    return (
      <>
        <MainCard value={0} income={0} expense={0} />
        <View style={styles.recentTransactionsContainer}>
          <RecentTransactions />
        </View>
      </>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.mainContainer}
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
  mainContainer: {},
  mainContentEmptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Metrics.largeMargin + Metrics.addTransactionButton,
  },
  mainContentContainer: {
    marginTop: Metrics.mediumMargin,
    paddingBottom: Metrics.largeMargin + Metrics.addTransactionButton,
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
