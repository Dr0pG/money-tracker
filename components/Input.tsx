import AnimatedThemedView from "@/components/AnimatedThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  ViewStyle,
} from "react-native";

type PropTypes = TextInputProps & {
  icon?: string;
  placeholder?: string;
  style?: ViewStyle | ViewStyle[];
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
  secureTextEntry?: boolean;
  hasError?: boolean;
  isRequired?: boolean;
  isBigInput?: boolean;
  errorMessage?: string;
  topPlaceholder?: string;
};

const Input = forwardRef<TextInput, PropTypes>(
  (
    {
      icon,
      placeholder,
      keyboardType = "default",
      secureTextEntry = false,
      style,
      hasError = false,
      isRequired = false,
      errorMessage = "",
      topPlaceholder = undefined,
      isBigInput = false,
      onFocus = () => {},
      ...props
    }: PropTypes,
    ref
  ) => {
    const [color, textPlaceholder, error] = useThemeColor({}, [
      "text",
      "textPlaceholder",
      "error",
    ]);

    const [showError, setError] = useState<boolean>(false);
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

    useEffect(() => {
      setError(hasError);
    }, [hasError]);

    const onChangeVisiblePassword = () =>
      setIsVisiblePassword(!isVisiblePassword);

    const renderTopPlaceholder = useCallback(() => {
      if (!topPlaceholder) return;
      const formattedPlaceholder = `${placeholder} ${isRequired ? "*" : ""}`;
      return (
        <ThemedText style={styles.topPlaceholderText}>
          {formattedPlaceholder}
        </ThemedText>
      );
    }, [topPlaceholder]);

    const renderIcon = useCallback(() => {
      if (!icon) return;

      switch (icon) {
        case "search": {
          return (
            <AntDesign
              name="search1"
              size={Metrics.iconInput}
              color={color}
              style={styles.icon}
            />
          );
        }
        case "name":
          return (
            <AntDesign
              name="user"
              size={Metrics.iconInput}
              color={color}
              style={styles.icon}
            />
          );
        case "email":
          return (
            <Entypo
              name="email"
              size={Metrics.iconInput}
              color={color}
              style={styles.icon}
            />
          );
        case "password":
          return (
            <Entypo
              name="suitcase"
              size={Metrics.iconInput}
              color={color}
              style={styles.icon}
            />
          );
        default:
          return null;
      }
    }, [icon, color]);

    const renderPasswordIcon = useCallback(() => {
      if (icon !== "password" || errorMessage && showError) return;

      return (
        <Entypo
          name={isVisiblePassword ? "eye-with-line" : "eye"}
          size={Metrics.iconInput}
          color={color}
          onPress={onChangeVisiblePassword}
        />
      );
    }, [isVisiblePassword, errorMessage, showError]);

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

    return (
      <ThemedView style={styles.inputContainer}>
        {renderTopPlaceholder()}
        <ThemedView
          style={[
            styles.inputWrapper,
            { borderColor: showError ? error : color },
            style,
          ]}
        >
          {renderIcon()}
          <TextInput
            ref={ref}
            placeholder={placeholder}
            style={[styles.input, { color }, isBigInput && styles.bigInput]}
            placeholderTextColor={textPlaceholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !isVisiblePassword}
            onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              onFocus?.(e);
              setError(false);
            }}
            {...(isBigInput && {
              multiline: true,
            })}
            {...props}
          />
          {renderPasswordIcon()}
          {renderErrorIcon()}
        </ThemedView>
        {renderErrorText()}
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: Metrics.mediumMargin,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Metrics.largeRadius,
    paddingHorizontal: Metrics.mediumPadding,
    paddingVertical: Metrics.smallPadding,
  },
  icon: {
    marginRight: Metrics.mediumPadding,
  },
  input: {
    flex: 1,
    height: Metrics.heightInput,
  },
  bigInput: {
    height: Metrics.heightInput * 2,
    textAlignVertical: "top",
    paddingTop: Metrics.smallPadding,
  },
  errorText: {
    marginTop: Metrics.smallMargin,
  },
  topPlaceholderText: {
    marginBottom: Metrics.smallMargin,
    fontWeight: "bold",
  },
});

export default memo(Input);
