import React, { memo } from "react";
import { Stack } from "expo-router";

const Home = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default memo(Home);
