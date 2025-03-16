import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { capitalizeFirstLetter } from "@/utils/Helpers";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

type OptionsPropTypes = {
  data: string[];
  onPress: (value: string) => void;
};

const Options = ({ data, onPress }: OptionsPropTypes) => {
  const { theme } = useTheme();

  const backButtonBackground = useThemeColor({}, "backButtonBackground");

  const renderItem = ({ item }: { item: string }) => {
    const text = capitalizeFirstLetter(item);
    return (
      <Pressable
        onPress={() => {
          onPress(item);
          Keyboard.dismiss();
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? backButtonBackground : "transparent",
          },
          styles.optionContainer,
        ]}
      >
        <ThemedText>{text}</ThemedText>
      </Pressable>
    );
  };

  return (
    <FlatList
      keyExtractor={(item) => item}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      indicatorStyle={theme === "dark" ? "white" : "black"}
    />
  );
};

type PropTypes = {
  placeholder: string;
  isRequired?: boolean;
  options: string[];
  style?: ViewStyle | ViewStyle[];
  wrapperStyle?: ViewStyle | ViewStyle[];
  onChangeValue: (value: string) => void;
};

const DropDown = ({
  placeholder,
  isRequired = false,
  options,
  style,
  wrapperStyle,
  onChangeValue,
}: PropTypes) => {
  const { t } = useTranslation();

  const color = useThemeColor({}, "text");
  const backgroundDark = useThemeColor({}, "backgroundDark");
  const modalBackground = useThemeColor({}, "modalBackground");

  const [selectedValue, setSelectedValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (options?.length === 1) setSelectedValue(options[0]);
  }, [options]);

  useEffect(() => {
    onChangeValue(selectedValue);
  }, [selectedValue]);

  const onSetShowOptions = () => {
    if (options?.length === 1) return;
    setShowOptions((prevValue) => !prevValue);
  };

  const onChange = (value: string) => {
    if (!value) {
      setShowOptions(false);
      return;
    }

    setSelectedValue(value);
    onSetShowOptions();
  };

  const renderTopPlaceholder = useCallback(() => {
    if (!placeholder) return;
    const formattedPlaceholder = `${placeholder} ${isRequired ? "*" : ""}`;
    return (
      <ThemedText style={styles.placeholderText}>
        {formattedPlaceholder}
      </ThemedText>
    );
  }, [placeholder, isRequired]);

  const renderSelectedOption = useCallback(() => {
    return (
      <ThemedText type={selectedValue ? "default" : "gray"}>
        {capitalizeFirstLetter(selectedValue) || t("select_item")}
      </ThemedText>
    );
  }, [selectedValue]);

  const renderIcon = () => {
    return (
      <Entypo name="chevron-down" size={Metrics.dropdownIcon} color={color} />
    );
  };

  const renderOptions = () => {
    return (
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View
            style={[styles.modalOverlay, { backgroundColor: modalBackground }]}
          >
            <View
              style={[
                styles.optionsContainer,
                { backgroundColor: backgroundDark, borderColor: color },
              ]}
            >
              <Options data={options} onPress={onChange} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
      <>
        <ThemedView style={[styles.container, style]}>
          {renderTopPlaceholder()}
          <Pressable onPress={onSetShowOptions}>
            <ThemedView
              style={[styles.wrapper, { borderColor: color }, wrapperStyle]}
            >
              {renderSelectedOption()}
              {renderIcon()}
            </ThemedView>
          </Pressable>
        </ThemedView>
        <View style={styles.modalContainer}>{renderOptions()}</View>
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Metrics.mediumMargin,
    zIndex: 5,
  },
  placeholderText: {
    fontWeight: "bold",
    marginBottom: Metrics.smallPadding,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Metrics.largeRadius,
    paddingHorizontal: Metrics.mediumPadding,
    height: Metrics.heightInput + Metrics.smallPadding * 2,
  },
  modalContainer: {
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    width: Metrics.screenWidth - Metrics.largeMargin * 2,
    maxHeight: 280,
    borderRadius: Metrics.largeRadius,
    borderWidth: 1,
    overflow: "hidden",
  },
  separator: {
    height: Metrics.largePadding,
  },
  optionContainer: {
    paddingVertical: Metrics.mediumPadding,
    paddingHorizontal: Metrics.largePadding,
  },
});

export default DropDown;
