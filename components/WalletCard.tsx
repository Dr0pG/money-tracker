import ThemedText from "@/components/ThemedText";
import TouchableOpacity from "@/components/TouchableOpacity";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import userStore from "@/store/userStore";
import { formatEuropeanNumber } from "@/utils/Helpers";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import React from "react";
import { Image as RNImage, StyleSheet, View } from "react-native";

const DEFAULT_IMAGE = RNImage.resolveAssetSource(
  require("@/assets/images/wallet-placeholder.jpg")
).uri;

type PropTypes = {
  name: string;
  image?: string;
  total: number;
  onPress: () => void;
};

const WalletCard = ({ name, image, total, onPress }: PropTypes) => {
  const { currency } = userStore();

  const color = useThemeColor({}, "text");

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.walletContainer}>
        <View style={styles.leftContent}>
          <Image
            source={{ uri: image || DEFAULT_IMAGE }}
            style={styles.image}
          />
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
        <Entypo
          name="chevron-right"
          size={Metrics.walletRightIcon}
          color={color}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Metrics.mediumMargin,
  },
  walletTotal: { fontSize: Metrics.size12, lineHeight: Metrics.size12 * 1.3 },
  leftContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  image: {
    width: Metrics.walletImage,
    height: Metrics.walletImage,
    borderRadius: Metrics.mediumRadius,
    marginRight: Metrics.mediumMargin,
  },
  infoContainer: { flexDirection: "column" },
});

export default WalletCard;
