import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThemedView from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useThemeColor } from "@/hooks/useThemeColor";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";
import AnimatedThemedView from "@/components/AnimatedThemedView";

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
      errorMessage = "",
      topPlaceholder = undefined,
      onFocus = () => {},
      ...props
    }: PropTypes,
    ref
  ) => {
    const color = useThemeColor({}, "text");
    const textPlaceholder = useThemeColor({}, "textPlaceholder");
    const error = useThemeColor({}, "error");

    const [showError, setError] = useState(false);

    useEffect(() => {
      setError(hasError);
    }, [hasError]);

    const renderTopPlaceholder = useCallback(() => {
      if (!topPlaceholder) return;
      return (
        <ThemedText style={styles.topPlaceholderText}>
          {topPlaceholder}
        </ThemedText>
      );
    }, [topPlaceholder]);

    const renderIcon = useCallback(() => {
      if (!icon) return;

      switch (icon) {
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
            style={[styles.input, { color }]}
            placeholderTextColor={textPlaceholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              onFocus?.(e);
              setError(false);
            }}
            {...props}
          />
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
  errorText: {
    marginTop: Metrics.smallMargin,
  },
  topPlaceholderText: {
    marginBottom: Metrics.smallMargin,
    fontWeight: "bold",
  },
});

export default memo(Input);
