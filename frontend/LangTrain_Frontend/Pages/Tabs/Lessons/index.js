"use client";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  SectionList,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import chineseLearn from "../../../assets/lessons_head_image.jpg";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "../../../Components/FormInput";
import CustomButton from "../../../Components/CustomButton";
import fetchVocab from "./generate_vocab";

const Lessons = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState([
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ]);

  const handleGenerateLesson = async () => {
    setIsLoading(true);
    try {
      const generatedVocab = await fetchVocab(topic, value);
      if (generatedVocab && generatedVocab.length > 0) {
        // Navigate only after the vocab has been successfully generated
        navigation.navigate("LessonWrapper", { vocab: generatedVocab });
      } else {
        console.error("No vocabulary generated. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      {isLoading ? (
        <View className="h-screen w-full items-center my-auto justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-lg">Loading...</Text>
        </View>
      ) : (
        <ScrollView className="h-screen bg-white w-full flex flex-col pb-2">
          <View
            id="lessons-header-container"
            className="mt-8 items-center w-full h-11/12"
          >
            <Text className="text-2xl items-center font-bold">
              Learn Mandarin Your Way
            </Text>

            <Image
              source={chineseLearn}
              className="w-full h-full mt-4 object-fit"
            />
          </View>
          <View className="mt-10 w-full">
            <Text className="ml-8 text-xl font-semibold">
              Create your own lesson
            </Text>
            <FormInput
              title=""
              placeholder="ex. Groceries, Going to School"
              otherStyles="w-5/6 mx-auto"
              value={topic}
              handleChangeText={setTopic}
            />
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={"Choose a difficulty."}
              listMode="SCROLLVIEW"
              className="w-5/6 mx-auto mt-4"
            />

            <CustomButton
              title="Generate Lesson"
              containerStyles="w-5/6 mt-4 mx-auto py-2"
              handlePress={handleGenerateLesson}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Lessons;
