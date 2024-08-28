import { View, Text } from "react-native";
import React from "react";

const SentenceDefinition = ({ translation, text, pinyin }) => {
  return (
    <View className="mt-4 items-center">
      <Text className="text-lg mt-2">{pinyin}</Text>
      <Text className="text-xl text-center">{text}</Text>
      <Text className="text-lg mt-2">{translation}</Text>
    </View>
  );
};

export default SentenceDefinition;
