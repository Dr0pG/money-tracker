import React, { memo } from "react";
import { Stack } from "expo-router";

const Statistics = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default memo(Statistics);
