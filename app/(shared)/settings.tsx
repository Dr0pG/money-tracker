import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import Header from "@/components/Header";
import ThemedView from "@/components/ThemedView";
import Toast from "@/components/Toast";
import Metrics from "@/constants/Metrics";
import { changeLanguage } from "@/i18n";
import { formatLanguage } from "@/utils/Helpers";
import { getLanguages } from "@/utils/Languages";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.languages[0]);

  const onSave = () => {
    changeLanguage(currentLanguage);

    Toast.showSuccess(t("changes_updated"));
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
          isRequired
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
      <Header title="profile.settings" />
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
  mainContent: {
    paddingBottom: Metrics.mediumPadding,
  },
  buttonContainer: {
    paddingVertical: Metrics.mediumPadding,
  },
});

export default Settings;
