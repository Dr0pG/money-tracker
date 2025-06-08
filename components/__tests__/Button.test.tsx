import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "@/components/Button";
import { ThemeProvider } from "@/context/ThemeContext";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // mock t() returns the key itself
  }),
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: () => ["#000000", "#999999", "#ffffff"], // background, disabledText, textColor
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("Button", () => {
  it("renders the text correctly", () => {
    const { getByText } = renderWithProviders(<Button text="submit" />);
    expect(getByText("SUBMIT")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockFn = jest.fn();
    const { getByTestId } = renderWithProviders(
      <Button testID="custom-button" text="submit" onPress={mockFn} />
    );
    fireEvent.press(getByTestId("custom-button"));
    expect(mockFn).toHaveBeenCalled();
  });

  it("disables the button when disabled is true", () => {
    const mockFn = jest.fn();
    const { getByTestId } = renderWithProviders(
      <Button testID="custom-button" text="submit" onPress={mockFn} disabled />
    );
    fireEvent.press(getByTestId("custom-button"));
    expect(mockFn).not.toHaveBeenCalled();
  });

  it("shows loader when isLoading is true", () => {
    const { queryByText, getByRole } = renderWithProviders(
      <Button text="submit" isLoading />
    );
    expect(queryByText("SUBMIT")).toBeNull();
    expect(getByRole("progressbar")).toBeTruthy();
  });
});
