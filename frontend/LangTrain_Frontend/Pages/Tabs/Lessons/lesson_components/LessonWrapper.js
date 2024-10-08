"use client";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ProgressBar } from "react-native-paper";
import SentenceDefinition from "./SentenceDefinition";
import VocabDefinition from "./VocabDefinition";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import generateSpeech from "../pronounce_vocab";

const LessonWrapper = ({ route, navigation }) => {
  // extract the vocab from the previous page
  const { vocab } = route.params;

  //parse the lesson from the vocab object
  const parseLesson = (lesson) => {
    const parsedLesson = [];

    lesson.forEach((item) => {
      parsedLesson.push({
        type: "definition",
        text: item.text,
        pinyin: item.pinyin,
        definition: item.definition,
        audioBase64: item.audioBase64,
        image: item.image,
      });

      parsedLesson.push({
        type: "sentence",
        text: item.sentence.text,
        pinyin: item.sentence.pinyin,
        translation: item.sentence.translation,
        audioBase64: item.sentence.audioBase64,
        image: item.image,
      });
    });

    return parsedLesson;
  };

  const parsedVocab = parseLesson(vocab);

  //state
  const [sound, setSound] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const progress = (currentStep + 1) / parsedVocab.length;

  //functions
  const handleExit = () => {
    navigation.navigate("Lessons");
  };
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, parsedVocab.length - 1));
  };
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const handlePlayAudio = async () => {
    const currentItem = parsedVocab[currentStep];

    if (currentItem.text) {
      try {
        // Generate and play the speech
        generateSpeech(currentItem.text);
      } catch (e) {
        console.error("Failed to generate and play speech: ", e);
      }
    } else {
      console.log("No text for this step");
    }
  };

  const handleSlowAudio = async () => {
    const currentItem = parsedVocab[currentStep];

    if (currentItem.text) {
      try {
        // Generate and play the speech slowly
        Speech.speak(currentItem.text, {
          language: "zh-CN",
          pitch: 1.0,
          rate: 0.5, // Slow down the speech rate
        });
      } catch (e) {
        console.error("Failed to generate and play speech slowly: ", e);
      }
    } else {
      console.log("No text for this step");
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <SafeAreaView className="flex-1 flex flex-col items-center">
      <View className="w-full">
        <ScrollView className="h-screen flex flex-col">
          <View className="w-5/6 mx-auto mt-4">
            <ProgressBar progress={progress} color={"#6200ee"} />
          </View>

          <View
            id="lesson-wrap-header"
            className="w-5/6 mt-2 flex flex-row mx-auto"
          >
            <TouchableOpacity onPress={handleExit}>
              <MaterialCommunityIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View className="w-full flex items-center mt-8">
            <Image
              source={{ uri: parsedVocab[currentStep].image }}
              className="w-[50%] h-[25vh] rounded-lg"
            />
          </View>
          <View className="w-full items-center">
            {parsedVocab[currentStep].type === "definition" ? (
              <VocabDefinition
                word={parsedVocab[currentStep].text}
                pinyin={parsedVocab[currentStep].pinyin}
                definition={parsedVocab[currentStep].definition}
              />
            ) : (
              <SentenceDefinition
                text={parsedVocab[currentStep].text}
                translation={parsedVocab[currentStep].translation}
                pinyin={parsedVocab[currentStep].pinyin}
              />
            )}
          </View>
        </ScrollView>
      </View>
      <View
        id="lesson-wrap-footer"
        className="flex flex-row w-5/6 absolute bottom-10 justify-between"
      >
        {currentStep > 0 && (
          <TouchableOpacity onPress={handlePrevious}>
            <MaterialCommunityIcons name="chevron-left" size={24} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handlePlayAudio}>
          <MaterialCommunityIcons name="volume-high" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSlowAudio}>
          <MaterialCommunityIcons name="speedometer-slow" size={24} />
        </TouchableOpacity>

        {currentStep < parsedVocab.length - 1 && (
          <TouchableOpacity onPress={handleNext}>
            <MaterialCommunityIcons name="chevron-right" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LessonWrapper;
