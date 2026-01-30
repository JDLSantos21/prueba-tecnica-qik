import { useEffect } from "react";
import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client/react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { apolloClient } from "@/lib/apollo/client";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { KeyboardProvider } from "react-native-keyboard-controller";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>

      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <KeyboardProvider>
        <RootLayoutNav />
      </KeyboardProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
});
