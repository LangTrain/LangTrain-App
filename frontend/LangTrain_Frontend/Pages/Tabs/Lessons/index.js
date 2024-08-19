"use client";
import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import chineseLearn from "../../../assets/lessons_head_image.jpg";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "../../../Components/FormInput";
import CustomButton from "../../../Components/CustomButton";

const Lessons = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Lesson 1", value: "lesson1" },
    { label: "Lesson 2", value: "lesson2" },
    { label: "Lesson 3", value: "lesson3" },
  ]);

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="h-screen bg-white w-full flex flex-col">
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
        <View className="mt-16 w-full">
          <Text className="ml-8 text-xl font-semibold">
            Create your own lesson
          </Text>
          <FormInput
            title=""
            placeholder="ex. Groceries, Going to School"
            otherStyles="w-5/6 mx-auto"
          />

          <CustomButton
            title="Generate Lesson"
            containerStyles="w-5/6 mt-4 mx-auto py-2"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Lessons;
