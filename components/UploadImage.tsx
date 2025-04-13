import ThemedText from "@/components/ThemedText";
import TouchableOpacity from "@/components/TouchableOpacity";
import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import Shadow from "@/constants/Shadow";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type PropTypes = {
  title: string;
  imageUrl?: string;
  onImagePicked: (uri: string) => void;
  onRemoveImage: () => void;
};

const UploadImage = ({
  title,
  imageUrl,
  onImagePicked,
  onRemoveImage,
}: PropTypes) => {
  const { t } = useTranslation();

  const [color, removeImageColor] = useThemeColor({}, ["text", "red"]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const renderContent = useCallback(() => {
    if (!imageUrl)
      return (
        <TouchableOpacity
          style={[styles.uploadContainer, { borderColor: color }]}
          onPress={pickImage}
        >
          <MaterialIcons
            name="upload-file"
            size={Metrics.uploadImage}
            color={color}
            style={styles.icon}
          />
          <ThemedText>{t("upload_image")}</ThemedText>
        </TouchableOpacity>
      );

    return (
      <Animated.View
        style={styles.imageContainer}
        entering={FadeInDown.duration(Durations.animations).springify()}
        exiting={FadeOutDown.duration(Durations.animations).springify()}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={[styles.removeImage, { backgroundColor: removeImageColor }]}
          onPress={onRemoveImage}
        >
          <Ionicons name="close-sharp" size={Metrics.removeButton} color={color} />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [imageUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Metrics.mediumMargin,
  },
  textContainer: {
    marginBottom: Metrics.smallMargin,
  },
  title: {
    fontWeight: "bold",
  },
  info: {
    fontSize: Metrics.size12,
    lineHeight: Metrics.size12 * 1.5,
    fontWeight: "bold",
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    padding: Metrics.largePadding,
    borderRadius: Metrics.mediumRadius,
    flexDirection: "row",
  },
  icon: {
    marginRight: Metrics.smallMargin,
  },
  imageContainer: {
    width: Metrics.imageSize,
    height: Metrics.imageSize,
    borderRadius: Metrics.imageSize,
    overflow: "hidden",
    ...Shadow.default,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Metrics.imageSize,
  },
  removeImage: {
    position: "absolute",
    top: Metrics.smallMargin,
    right: Metrics.smallMargin,
    width: Metrics.removeButton,
    height: Metrics.removeButton,
    borderRadius: Metrics.removeButton,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(UploadImage);
