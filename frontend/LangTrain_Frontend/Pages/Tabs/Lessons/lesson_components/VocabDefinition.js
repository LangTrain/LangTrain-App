import { View, Text } from "react-native";
import React from "react";

const VocabDefinition = ({ word, pinyin, definition }) => {
  return (
    <View className="mt-4 items-center">
      <Text className="text-2xl font-bold">{word}</Text>
      <Text className="text-2xl font-bold">{pinyin}</Text>
      <Text className="text-lg mt-2">{definition}</Text>
    </View>
  );
};

export default VocabDefinition;
