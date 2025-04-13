import { Dimensions } from "react-native";
import { hasNotch } from "react-native-device-info";

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
  size10: 10,
  size12: 12,
  size14: 14,
  size16: 16,
  size18: 18,
  size20: 20,
  size22: 22,
  size24: 24,
  size26: 26,
  size28: 28,
  size30: 30,
  size32: 32,
  size34: 34,

  // Border Radius
  smallRadius: 4,
  mediumRadius: 8,
  largeRadius: 16,

  // Input
  heightInput: 50,
  iconInput: 28,

  // Button
  heightButton: 60,
  textButton: 16,

  addTransactionButton: 50,

  // Upload Image
  imageSize: 200,

  // Profile Image
  profileImage: 150,

  // Wallet Image
  walletImage: 50,

  // Remove Image Button
  removeButton: 30,

  // Update Image Button
  updateImageButton: 30,

  // Create Wallet
  createWalletButton: 30,

  // Tab
  tabHeight: 45,

  // Icons
  backIcon: 28,

  backButtonSize: 40,

  searchIcon: 24,
  searchButtonSize: 40,

  cardDotsIcon: 20,
  cardInfoIcon: 16,
  cardInfoSize: 24,

  bottomBarIcon: 26,

  transactionIcon: 22,

  addTransactionIcon: 28,

  uploadImage: 26,

  profileIcons: 24,
  profileIconsBackgroundSize: 50,

  dropdownIcon: 24,
  walletRightIcon: 22,

  selectedIcon: 24,

  createWalletIcon: 22,

  trashSize: 50,
  trashDeleteIcon: 24,

  // BottomBar
  bottomBarHeight: hasNotch() ? 80 : 60,

  // Screen Dimensions
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
};

export default Metrics;
