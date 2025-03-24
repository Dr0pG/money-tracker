import ThemedText from "@/components/ThemedText";
import Metrics from "@/constants/Metrics";
import userStore from "@/store/userStore";
import { formatEuropeanNumber } from "@/utils/Helpers";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

type PropTypes = {
  name: string;
  image?: string;
  total: number;
};

const WalletCard = ({ name, image, total }: PropTypes) => {
  const { currency } = userStore();

  return (
    <View style={styles.walletContainer}>
      {!!image && (
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
      )}
      <View style={styles.infoContainer}>
        <ThemedText>{name}</ThemedText>
        <ThemedText
          type="gray"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.walletTotal}
        >
          {`${formatEuropeanNumber(total) + currency}`}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletTotal: {
    fontSize: Metrics.size12,
    lineHeight: Metrics.size12 * 1.3,
  },
  image: {
    width: Metrics.walletImage,
    height: Metrics.walletImage,
    borderRadius: Metrics.mediumRadius,
    marginRight: Metrics.mediumMargin
  },
  infoContainer: {
    flexDirection: "column",
  },
});

export default WalletCard;
