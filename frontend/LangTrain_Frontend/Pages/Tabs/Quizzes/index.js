import { Text, View, Pressable, Image } from "react-native";
import LevelBottom from "../../../assets/quiz/LevelBottom.png";
import React from "react";

/*
  Note for Quiz features:
  if admin wants to delete the quiz from firestore,
  we first need to find quizBank/CreatedQuiz/{your topic name}
  after that we STILL need to go to GeneratedQuizMetaInfo/{the document that has your topic under topic variable}
*/

export default function QuizLevel({ navigation }) {
  const handlePress = (difficulty) => {
    // Navigate to the quiz screen with the selected difficulty
    navigation.navigate("Quiz", {
      difficulty,
      topic: "navigate only difficulty",
    });
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800 mb-5">
          📝 Make My Own Quiz
        </Text>

        <Pressable
          className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center"
          onPress={() => navigation.navigate("CreateQuiz")}
        >
          <Text className="text-white text-lg font-bold">✍️ Create</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-gray-800 mb-5 mt-5">
          📓 Quiz Library
        </Text>
        <Pressable
          className="bg-blue-700 py-4 px-8 rounded-md my-2 w-4/5 items-center"
          onPress={() => navigation.navigate("CreatedQuizesList")}
        >
          <Text className="text-white text-lg font-bold">📚 Quiz Sets</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-gray-800 mb-5 mt-5">
          📕 Review
        </Text>
        <Pressable
          className="bg-red-800 py-4 px-8 rounded-md my-2 w-4/5 items-center"
          onPress={() => navigation.navigate("MyMistakes")}
        >
          <Text className="text-white text-lg font-bold">😫 My Mistakes</Text>
        </Pressable>
      </View>

      <Image
        source={LevelBottom}
        className="w-11/12 h-44 self-center"
        style={{ resizeMode: "contain" }}
      />
    </View>
  );
}
