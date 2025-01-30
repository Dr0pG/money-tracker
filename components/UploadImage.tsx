import { StyleSheet, View } from "react-native";
import ThemedText from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import Metrics from "@/constants/Metrics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TouchableOpacity from "@/components/TouchableOpacity";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import Shadow from "@/constants/Shadow";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Durations from "@/constants/Durations";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const color = useThemeColor({}, "text");
  const removeImageColor = useThemeColor({}, "red");

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
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
        />
        <TouchableOpacity
          style={[styles.removeImage, { backgroundColor: removeImageColor }]}
          onPress={onRemoveImage}
        >
          <Ionicons name="close-sharp" size={24} color={color} />
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
    borderRadius: Metrics.largeRadius,
    overflow: "hidden",
    ...Shadow.default,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Metrics.largeRadius,
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
