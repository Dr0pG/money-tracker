import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock";

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
