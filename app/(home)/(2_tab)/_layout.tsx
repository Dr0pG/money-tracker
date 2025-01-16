import React, { memo } from "react";
import { Stack } from "expo-router";

const Wallets = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="createWallet"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default memo(Wallets);
