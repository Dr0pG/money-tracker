import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

import failOnConsole from "jest-fail-on-console";

require("jest-fetch-mock").enableMocks();

failOnConsole();

global.fetch = jest.fn();
global.setImmediate =
  global.setImmediate ||
  function (cb) {
    return setTimeout(cb, 0);
  };

jest.retryTimes(3, { logErrorsBeforeRetry: true });

jest.mock("react-native-device-info", () => mockRNDeviceInfo);

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("@backpackapp-io/react-native-toast", () => {
  const toast = jest.fn();
  toast.success = jest.fn();
  toast.error = jest.fn();
  return { toast };
});

jest.mock("@expo/vector-icons/Ionicons", () => {
  const React = require("react");
  return (props) => null; // simple functional component that renders nothing
});

jest.mock("expo-font");
jest.mock("expo-asset");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: {
    type: "3rdParty", // mock shape to avoid errors
  },
}));
