import Back from "@/components/Back";
import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { changeLanguage } from "@/i18n";
import { formatLanguage } from "@/utils/Helpers";
import { getLanguages } from "@/utils/Languages";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const router = useRouter();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.languages[0]);

  const onBack = () => router.back();

  const onSave = () => {
    changeLanguage(currentLanguage);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("profile.settings")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View style={styles.mainContent}>
        <DropDown
          placeholder={t("language")}
          value={currentLanguage}
          label={formatLanguage(currentLanguage)}
          options={getLanguages()}
          onChangeValue={setCurrentLanguage}
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {renderOptions()}
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button text={t("save")} onPress={onSave} />
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.largePadding,
    paddingBottom: Metrics.mediumPadding,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightWidth: {
    width: Metrics.backButtonSize,
  },
  mainContent: {
    paddingVertical: Metrics.largePadding,
  },
  buttonContainer: {
    paddingVertical: Metrics.mediumPadding,
  },
});

export default Settings;
