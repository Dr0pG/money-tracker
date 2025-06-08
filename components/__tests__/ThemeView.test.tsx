import React from "react";
import { render } from "@testing-library/react-native";
import ThemedView from "@/components/ThemedView";
import { ThemeProvider } from "@/context/ThemeContext";

describe("ThemedView", () => {
  it("renders correctly with light theme", () => {
    const { toJSON } = render(
      <ThemeProvider initialTheme="light">
        <ThemedView testID="themed-view" />
      </ThemeProvider>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with dark theme", () => {
    const { toJSON } = render(
      <ThemeProvider initialTheme="dark">
        <ThemedView testID="themed-view" />
      </ThemeProvider>
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
