import { Dimensions } from "react-native";

const Metrics = {
  // Margins
  smallMargin: 8,
  mediumMargin: 16,
  largeMargin: 24,

  // Padding
  smallPadding: 8,
  mediumPadding: 16,
  largePadding: 24,

  // Font Sizes
  smallText: 14,
  defaultText: 16,
  mediumText: 18,
  subtitleText: 20,
  titleText: 24,
  bigTitleText: 28,
  veryBigTitleText: 32,

  // Border Radius
  smallRadius: 4,
  mediumRadius: 8,
  largeRadius: 16,

  // Input
  heightInput: 50,
  iconInput: 28,

  // Button
  heightButton: 60,
  textButton: 18,

  // Icons
  backIcon: 28,

  backButtonSize: 40,

  // Screen Dimensions
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
};

export default Metrics;
