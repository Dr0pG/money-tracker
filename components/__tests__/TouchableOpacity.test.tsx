import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TouchableOpacity from "@/components/TouchableOpacity";
import { Text } from "react-native";

describe("TouchableOpacity", () => {
  it("renders children", () => {
    const { getByText } = render(
      <TouchableOpacity>
        <Text>Click me</Text>
      </TouchableOpacity>
    );
    expect(getByText("Click me")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TouchableOpacity onPress={onPressMock}>
        <Text>Tap me</Text>
      </TouchableOpacity>
    );

    fireEvent.press(getByText("Tap me"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("does not call onPress when disabled", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TouchableOpacity onPress={onPressMock} disabled>
        <Text>Can't tap</Text>
      </TouchableOpacity>
    );

    fireEvent.press(getByText("Can't tap"));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it("uses GesturePressable when useGestureHandler is true", () => {
    const { UNSAFE_getByType } = render(
      <TouchableOpacity useGestureHandler>
        <Text>Gesture</Text>
      </TouchableOpacity>
    );

    // Matches 'react-native-gesture-handler' component
    const gestureComponent = UNSAFE_getByType(
      require("react-native-gesture-handler").Pressable
    );
    expect(gestureComponent).toBeTruthy();
  });

  it("uses RNTouchableOpacity when useGestureHandler is false", () => {
    const { UNSAFE_getByType } = render(
      <TouchableOpacity useGestureHandler={false}>
        <Text>Touchable</Text>
      </TouchableOpacity>
    );

    const touchableComponent = UNSAFE_getByType(
      require("react-native").TouchableOpacity
    );
    expect(touchableComponent).toBeTruthy();
  });
});
