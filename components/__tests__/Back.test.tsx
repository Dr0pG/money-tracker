// __tests__/Back.test.tsx
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import Back from "@/components/Back";

// Mock TouchableOpacity (if it's custom)
jest.mock("@/components/TouchableOpacity", () => {
  const { TouchableOpacity } = require("react-native");
  return TouchableOpacity;
});

// Mock useThemeColor
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn().mockReturnValue(["#000", "#eee"]),
}));

describe("Back button", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Back />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockFn = jest.fn();
    const { getByTestId } = render(<Back onPress={mockFn} />);
    const button = getByTestId("back-button");

    fireEvent.press(button);

    expect(mockFn).toHaveBeenCalled();
  });
});
