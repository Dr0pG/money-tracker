import AnimatedThemedView from "@/components/AnimatedThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formateDate } from "@/utils/Helpers";
import Entypo from "@expo/vector-icons/Entypo";

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type PropTypes = TextInputProps & {
  value?: string;
  isRequired?: boolean;
  placeholder?: string;
  style?: ViewStyle | ViewStyle[];
  hasError?: boolean;
  errorMessage?: string;
  onChangeValue: (value: string) => void;
};

const DatePicker = forwardRef(
  (
    {
      value,
      isRequired = false,
      placeholder,
      style,
      hasError = false,
      errorMessage = "",
      onChangeValue,
    }: PropTypes,
    ref
  ) => {
    const { t } = useTranslation();

    const [color, error] = useThemeColor({}, ["text", "error"]);

    const [selectedDate, setSelectedDate] = useState<string>(
      new Date().toUTCString()
    );
    const [displayCalendar, setDisplayCalendar] = useState<boolean>(false);

    const [showError, setError] = useState<boolean>(false);

    useEffect(() => {
      if (!value || new Date(value).getDate() === new Date().getDate()) return;
      setSelectedDate(value);
    }, [value]);

    useEffect(() => {
      onChangeValue(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
      setError(hasError);
    }, [hasError]);

    const onSetDisplayCalendar = () => {
      Keyboard.dismiss();
      setDisplayCalendar((prevValue) => !prevValue);
    };

    const onChangeDate = (date: Date) => {
      setSelectedDate(date.toISOString());
      onSetDisplayCalendar();
    };

    const renderTopPlaceholder = useCallback(() => {
      if (!placeholder) return;
      const formattedPlaceholder = `${placeholder} ${isRequired ? "*" : ""}`;
      return (
        <ThemedText style={styles.topPlaceholderText}>
          {formattedPlaceholder}
        </ThemedText>
      );
    }, [placeholder, isRequired]);

    const renderErrorIcon = useCallback(() => {
      if (!errorMessage && !showError) return;

      return (
        <AnimatedThemedView animationType="fade">
          <Entypo
            name="circle-with-cross"
            size={Metrics.iconInput}
            color={error}
            onPress={() => {
              setError(false);
              ref?.current?.clear();
            }}
          />
        </AnimatedThemedView>
      );
    }, [errorMessage, showError]);

    const renderErrorText = useCallback(() => {
      if (!errorMessage && !showError) return;

      return (
        <ThemedText animationType="fade" type="error" style={styles.errorText}>
          {errorMessage}
        </ThemedText>
      );
    }, [errorMessage, showError]);

    const renderCalendar = () => {
      return (
        <View style={styles.calendarContainer}>
          <DateTimePickerModal
            date={new Date(selectedDate)}
            isVisible={displayCalendar}
            mode="date"
            onConfirm={onChangeDate}
            onCancel={() => setDisplayCalendar(false)}
          />
        </View>
      );
    };

    const renderSelectedDate = useCallback(() => {
      const parsedDate = new Date(selectedDate);

      return (
        <ThemedText type={selectedDate ? "default" : "gray"}>
          {formateDate(parsedDate) || t("select_date")}
        </ThemedText>
      );
    }, [selectedDate]);

    return (
      <>
        <ThemedView style={styles.inputContainer}>
          {renderTopPlaceholder()}
          <Pressable onPress={onSetDisplayCalendar}>
            <ThemedView
              style={[
                styles.inputWrapper,
                { borderColor: showError ? error : color },
                style,
              ]}
            >
              {renderSelectedDate()}
              {renderErrorIcon()}
            </ThemedView>
          </Pressable>
          {renderErrorText()}
        </ThemedView>
        {displayCalendar && renderCalendar()}
      </>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: Metrics.mediumMargin,
  },
  topPlaceholderText: {
    fontWeight: "bold",
    marginBottom: Metrics.smallPadding,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Metrics.largeRadius,
    paddingHorizontal: Metrics.mediumPadding,
    height: Metrics.heightInput + Metrics.smallPadding * 2,
  },
  icon: {
    marginRight: Metrics.mediumPadding,
  },
  input: {
    flex: 1,
    height: Metrics.heightInput,
  },
  errorText: {
    marginTop: Metrics.smallMargin,
  },
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
  },
  calendarContainer: {
    zIndex: 100,
  },
});

export default memo(DatePicker);
