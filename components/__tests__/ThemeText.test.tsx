import React from "react";
import { render } from "@testing-library/react-native";
import ThemedText from "@/components/ThemedText";

// Mock your theme hooks
jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: (_: any, colorName?: string | string[]) => {
    if (Array.isArray(colorName)) {
      // Return dummy colors array
      return colorName.map(() => "#123456");
    }
    return "#123456"; // default color
  },
}));

// Mock react-native-reanimated to avoid complex native behavior in tests
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // Override useDerivedValue and useAnimatedStyle to just return dummy values
  Reanimated.useDerivedValue = jest.fn().mockImplementation((fn) => {
    return { value: fn() };
  });
  Reanimated.useAnimatedStyle = jest.fn().mockImplementation((fn) => {
    return fn();
  });

  // Stub animation functions to undefined or no-op
  Reanimated.withTiming = jest.fn((value) => value);
  Reanimated.FadeInDown = {
    duration: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnValue("fadeIn"),
  };
  Reanimated.FadeOutDown = {
    duration: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnValue("fadeOut"),
  };
  Reanimated.BounceInDown = {
    duration: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnValue("bounceIn"),
  };
  Reanimated.BounceOutDown = {
    duration: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnValue("bounceOut"),
  };

  return Reanimated;
});

describe("ThemedText", () => {
  it("renders with default style and color", () => {
    const { getByText } = render(<ThemedText>Default Text</ThemedText>);
    const text = getByText("Default Text");
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: expect.any(Number) }),
        expect.objectContaining({ color: "#123456" }),
      ])
    );
  });

  it("applies style based on type prop", () => {
    const { getByText } = render(
      <ThemedText type="error">Error Text</ThemedText>
    );
    const text = getByText("Error Text");
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: expect.any(Number) }),
        expect.objectContaining({ color: "#123456" }),
      ])
    );
  });

  it("applies animation props when animationType is provided", () => {
    const { getByText } = render(
      <ThemedText animationType="fade">Animated Text</ThemedText>
    );
    const text = getByText("Animated Text");
    expect(text.props.entering).toBe("fadeIn");
    expect(text.props.exiting).toBe("fadeOut");
  });

  it("passes accessibilityLabel and accessible prop", () => {
    const { getByLabelText } = render(
      <ThemedText>Accessibility Text</ThemedText>
    );
    const text = getByLabelText("Accessibility Text");
    expect(text).toBeTruthy();
    expect(text.props.accessible).toBe(true);
  });
});
