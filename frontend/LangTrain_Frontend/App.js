import React from "react";
import AppNavigator from "./Nav/AppNavigator";
import "./firebase"; // Ensure Firebase is initialized
import { SessionProvider } from "./hooks/AuthProvider.tsx";

export default function App() {
  return (
    <SessionProvider>
      <AppNavigator />
    </SessionProvider>
  );
}
