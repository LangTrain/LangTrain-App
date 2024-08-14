import React from "react";
import AppNavigator from "./Nav/AppNavigator";
import "./firebase"; // Ensure Firebase is initialized
import { SessionProvider } from "./hooks/AuthProvider.tsx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <SessionProvider>
        <AppNavigator />
      </SessionProvider>
    </SafeAreaView>
  );
}
