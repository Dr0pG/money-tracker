import React, { memo } from "react";
import { Stack } from "expo-router";

const Profile = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default memo(Profile);
