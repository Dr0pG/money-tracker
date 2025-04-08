import ThemedText from "@/components/ThemedText";
import TouchableOpacity from "@/components/TouchableOpacity";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import userStore from "@/store/userStore";
import { formatEuropeanNumber } from "@/utils/Helpers";
import { Image } from "expo-image";
import React from "react";
import { Image as RNImage, StyleSheet, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

const DEFAULT_IMAGE = RNImage.resolveAssetSource(
  require("@/assets/images/wallet-placeholder.jpg")
).uri;

type PropTypes = {
  id: string;
  name: string;
  image?: string;
  total: number;
  isSelected: boolean;
  onEdit: () => void;
  onSelect: (id: string) => void;
};

const WalletCard = ({
  id,
  name,
  image,
  total,
  isSelected,
  onEdit,
  onSelect,
}: PropTypes) => {
  const { currency } = userStore();

  const [color, green] = useThemeColor({}, ["text", "green"]);

  return (
    <TouchableOpacity onPress={() => onSelect(id)} disabled={isSelected}>
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
        {isSelected && (
          <View style={styles.selectIcon}>
            <AntDesign
              name="checkcircleo"
              size={Metrics.walletRightIcon}
              color={green}
            />
          </View>
        )}
        <TouchableOpacity onPress={onEdit}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={Metrics.walletRightIcon}
            color={color}
          />
        </TouchableOpacity>
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
  selectIcon: {
    paddingHorizontal: Metrics.largePadding,
  },
});

export default WalletCard;
