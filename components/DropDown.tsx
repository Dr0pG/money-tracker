import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { capitalizeFirstLetter, transformArray } from "@/utils/Helpers";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

export type DataType = {
  value: string;
  label: string;
};

type OptionsPropTypes = {
  selectedValue: DataType;
  data: DataType[];
  onPress: (value: DataType) => void;
};

const Options = ({ selectedValue, data, onPress }: OptionsPropTypes) => {
  const { theme } = useTheme();

  const flatListRef = useRef(null);

  const backButtonBackground = useThemeColor({}, "backButtonBackground");
  const green = useThemeColor({}, "green");

  useEffect(() => {
    if (selectedValue) {
      const index = data.findIndex(
        (item) => item.value === selectedValue.value
      );
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Centers the item
        });
      }
    }
  }, [flatListRef, selectedValue]);

  const renderItem = ({ item }: { item: DataType }) => {
    const isSelected = item.value === selectedValue.value;
    const text = capitalizeFirstLetter(item.label);
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
          isSelected && { backgroundColor: backButtonBackground },
        ]}
      >
        <ThemedText>{text}</ThemedText>
        {isSelected && (
          <Entypo name="check" size={Metrics.selectedIcon} color={green} />
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      keyExtractor={(item) => item.value}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator
      indicatorStyle={theme === "dark" ? "white" : "black"}
      getItemLayout={(_, index) => ({
        length: Metrics.mediumPadding * 2,
        offset: Metrics.mediumPadding * 2 * index,
        index,
      })}
    />
  );
};

type PropTypes = {
  value?: string;
  label?: string;
  placeholder: string;
  isRequired?: boolean;
  options: DataType[] | string[];
  style?: ViewStyle | ViewStyle[];
  wrapperStyle?: ViewStyle | ViewStyle[];
  onChangeValue: (value: string) => void;
};

const DropDown = ({
  value,
  label,
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

  const [selectedValue, setSelectedValue] = useState<DataType>({
    value: "",
    label: "",
  });
  const [showOptions, setShowOptions] = useState(false);

  const formattedOptions = transformArray(options);

  useEffect(() => {
    if (
      !value ||
      value === selectedValue.value ||
      label === selectedValue.label
    )
      return;

    setSelectedValue({
      value: value,
      label: label || value,
    });
  }, [value, label]);

  useEffect(() => {
    if (formattedOptions?.length === 1) setSelectedValue(formattedOptions[0]);
  }, [formattedOptions]);

  useEffect(() => {
    onChangeValue(selectedValue.value);
  }, [selectedValue.value]);

  const onSetShowOptions = () => {
    if (formattedOptions?.length === 1) return;
    setShowOptions((prevValue) => !prevValue);
  };

  const onChange = (item: DataType) => {
    if (!item.value) {
      setShowOptions(false);
      return;
    }

    setSelectedValue(item);
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
      <ThemedText type={selectedValue.value ? "default" : "gray"}>
        {capitalizeFirstLetter(selectedValue.label) || t("select_item")}
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
              <Options
                selectedValue={selectedValue}
                data={formattedOptions}
                onPress={onChange}
              />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Metrics.mediumPadding,
    paddingHorizontal: Metrics.largePadding,
  },
});

export default DropDown;
