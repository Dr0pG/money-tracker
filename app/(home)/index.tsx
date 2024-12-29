import React, { memo } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { getUser } from "@/context/UserContext";
import Button from "@/components/Button";
import Authentication from "@/firebase/Authentication";

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { user } = getUser();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Olá! {user?.displayName}</ThemedText>
      <Button text={"Log out"} onPress={Authentication.signOut} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(Home);
