import FadeFlatList from "@/components/FadeFlatList";
import Loader from "@/components/Loader";
import ThemedText from "@/components/ThemedText";
import TransactionCard from "@/components/TransactionCard";
import Metrics from "@/constants/Metrics";
import Transactions from "@/firebase/Transactions";
import { Transaction, TransactionType } from "@/store/walletStore";
import { EventEmitterHelper, EventName } from "@/utils/EventEmitter";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

const RecentTransactions = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const onNavigateToTransaction = (transaction?: Transaction) => {
    if (!transaction) {
      router.navigate("../(shared)/addTransaction");
    } else {
      router.push({
        pathname: "/(shared)/addTransaction",
        params: { transaction: JSON.stringify(transaction) },
      });
    }
  };

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      try {
        const transactions: Transaction[] | null =
          await Transactions.getTransactions();

        if (!transactions?.length) return setTransactions([]);
        else setTransactions(transactions);
      } catch (error: any) {
        console.log("Getting Transactions error: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();

    const subscription = EventEmitterHelper.listen(
      EventName.UpdateTransactions,
      () => {
        getTransactions();
      }
    );

    return () => {
      EventEmitterHelper.remove(subscription);
    };
  }, []);

  const onDeleteTransaction = (id: string) => {
    Alert.alert(
      t("delete_transaction.delete_transaction"),
      t("delete_transaction.do_you_wanna_delete_this_transaction"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("ok").toUpperCase(),
          onPress: async () => await Transactions.deleteTransaction(id),
        },
      ]
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Loader />
        </View>
      );
    }

    return (
      <FadeFlatList
        data={transactions}
        scrollEnabled={false}
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
              onPress={() => onNavigateToTransaction(item as Transaction)}
            />
          );
        }}
        keyExtractor={(item) => {
          const transaction = item as Transaction;
          return transaction?.id;
        }}
        ListEmptyComponent={ListEmptyComponent}
        onDeleteItem={onDeleteTransaction}
      />
    );
  };

  return (
    <View>
      <ThemedText type="title" style={styles.title}>
        {t("home.recent_transactions")}
      </ThemedText>
      {renderContent()}
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
