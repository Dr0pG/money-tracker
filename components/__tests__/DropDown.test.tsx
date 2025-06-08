import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import DropDown from "@/components/DropDown";
import { ThemeProvider } from "@/context/ThemeContext";

// Mocks
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: {
    type: "3rdParty", // mock shape to avoid errors
  },
}));

jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: () => ["#000", "#111", "#222"], // mock colors
}));

jest.mock("@expo/vector-icons/Entypo", () => {
  const React = require("react");
  return (_: any) => <></>;
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("DropDown", () => {
  const mockOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];

  it("renders placeholder and no value initially", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        placeholder="Select item"
        options={mockOptions}
        onChangeValue={() => {}}
      />
    );
    expect(getByText("Select item ")).toBeTruthy();
  });

  it("opens modal on press", async () => {
    const { getByText, queryByText } = renderWithProviders(
      <DropDown
        placeholder="Select"
        options={mockOptions}
        onChangeValue={() => {}}
      />
    );

    fireEvent.press(getByText("select_item"));

    await waitFor(() => {
      expect(queryByText("Option 1")).toBeTruthy();
    });
  });

  it("calls onChangeValue when selecting an option", async () => {
    const onChangeValue = jest.fn();

    const { getByText } = renderWithProviders(
      <DropDown
        placeholder="Select"
        options={mockOptions}
        onChangeValue={onChangeValue}
      />
    );

    fireEvent.press(getByText("select_item"));
    await waitFor(() => getByText("Option 1"));

    fireEvent.press(getByText("Option 1"));

    await waitFor(() => {
      expect(onChangeValue).toHaveBeenCalledWith("opt1");
    });
  });

  it("pre-selects correct value based on props", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        placeholder="Pick"
        options={mockOptions}
        onChangeValue={() => {}}
        value="opt2"
        label="Option 2"
      />
    );

    expect(getByText("Option 2")).toBeTruthy();
  });
});
