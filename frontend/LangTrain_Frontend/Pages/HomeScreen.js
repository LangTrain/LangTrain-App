import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Chatbot from "./Chatbot/Chatbot";

const HomeScreen = () => {
  return (
    <View className="flex-1">
      {/* <Text>Welcome to the Home Screen</Text> */}
      {/* Move this to navbar after */}
      <Chatbot />
    </View>
  );
};

export default HomeScreen;
