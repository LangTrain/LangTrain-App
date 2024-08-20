import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Speech from "expo-speech";
import { fetchOpenAiResponse } from "./openAiApi"; // Import the API call function
import { auth, storage } from "../../../firebase";
import { ref, getDownloadURL } from "firebase/storage";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [speechRate, setSpeechRate] = useState(1); // Default rate is 1
  const [level, setLevel] = useState("Beginner"); // Add level state
  const [levelModalVisible, setLevelModalVisible] = useState(false); // Modal visibility for level
  const [availableLanguages, setAvailableLanguages] = useState([]); // State to store available languages
  const [userImage, setUserImage] = useState(null); // State for user profile image

  const levels = ["Beginner", "Intermediate", "Advanced", "Professional"]; // Level options

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        let imageUrl = auth.currentUser.photoURL;

        if (!imageUrl) {
          // If user's photoURL doesn't exist, use the default image in Firebase Storage
          const storageRef = ref(storage, "user.png");
          imageUrl = await getDownloadURL(storageRef);
        }

        setUserImage(imageUrl);
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };

    fetchUserProfileImage();
  }, []);

  const fetchVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log("Available voices:", voices);

      const filteredLanguages = voices.reduce((acc, voice) => {
        if (!acc.find((lang) => lang.code === voice.language)) {
          acc.push({ label: voice.language, code: voice.language });
        }
        return acc;
      }, []);

      setAvailableLanguages(filteredLanguages);
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  const refreshLanguages = () => {
    fetchVoices();
  };

  const speakText = (text, language) => {
    const options = {
      pitch: 1,
      rate: speechRate,
      language,
    };
    Speech.speak(text, options);
  };

  const handleSubmit = async () => {
    const messageContent = newMessage;

    const userMessage = {
      id: generateUniqueId(),
      role: "user",
      content: messageContent,
    };
    const aiMessage = {
      id: generateUniqueId(),
      role: "assistant",
      content: "Robin is thinking...",
    };

    setMessages((oldMessages) => [...oldMessages, userMessage, aiMessage]);
    setNewMessage("");

    try {
      const aiResponse = await fetchOpenAiResponse(
        messageContent,
        language,
        level
      );

      const [selectedLanguageResponse, englishResponse] =
        aiResponse.split("===");

      const cleanedSelectedLanguageResponse = selectedLanguageResponse.replace(
        /\n/g,
        " "
      );
      const cleanedEnglishResponse = englishResponse.replace(/\n/g, " ");

      setMessages((oldMessages) =>
        oldMessages.map((msg) =>
          msg.id === aiMessage.id
            ? {
                ...msg,
                content:
                  cleanedSelectedLanguageResponse +
                  "\n" +
                  cleanedEnglishResponse,
              }
            : msg
        )
      );

      if (isVoiceOn) {
        speakText(cleanedSelectedLanguageResponse, language); // Speak in the selected language
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", ` ${error}`);
    }
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  return (
    <View className="flex-1 bg-[#f0f4f7]">
      <View className="flex-1 p-4">
        <View className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <ScrollView className="flex-1">
            {messages.map((message) => (
              <View
                key={message.id}
                className={`p-4 ${
                  message.role === "assistant" ? "bg-[#e0f0ff]" : ""
                }`}
              >
                <View className="flex-row items-start space-x-3">
                  <Image
                    source={
                      message.role === "assistant"
                        ? require("../../../assets/lt-owl.png")
                        : {
                            uri:
                              userImage || require("../../../assets/user.png"),
                          }
                    }
                    className="w-8 h-8 rounded-full"
                  />
                  <Text className="flex-1 text-lg text-[#353535]">
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="mt-4 bg-[#e0f0ff] p-3 rounded-lg">
          <View className="flex-row items-center space-x-2 mb-2">
            <TextInput
              className="flex-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="Ask LangTrain"
              multiline
              numberOfLines={4}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#5bc0de] px-4 py-2 rounded-full"
            >
              <Text className="text-white">Send</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setIsVoiceOn(!isVoiceOn)}
              className="bg-[#5bc0de] px-4 py-2 rounded-full"
            >
              {isVoiceOn ? (
                <Text className="text-green-500">Voice On</Text>
              ) : (
                <Text className="text-white">Voice Off</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRateModalVisible(true)}
              className="bg-[#5bc0de] px-4 py-2 rounded-full"
            >
              <Text className="text-white">Speed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              className="bg-[#5bc0de] px-4 py-2 rounded-full"
            >
              <Text className="text-white">Language</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLevelModalVisible(true)}
              className="bg-[#5bc0de] px-4 py-2 rounded-full"
            >
              <Text className="text-white">Level</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Language selection modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-sky-200 bg-opacity-50">
          <View className="bg-white w-4/5 rounded-lg p-5 max-h-3/4">
            <Text className="text-lg text-[#353535] mb-3">Select Language</Text>
            <ScrollView className="mb-3">
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => {
                    setLanguage(language.code);
                    setLanguageModalVisible(false);
                  }}
                  className="p-2"
                >
                  <Text className="text-base text-[#353535]">
                    {language.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              title="Refresh"
              onPress={refreshLanguages}
              color="#5bc0de"
            />
            <Text className="text-xs text-center text-[#353535] mt-2">
              Don't see the language you're looking for? Go to Phone settings >
              Languages > Find option to download language packs > Download pack
              for the language you'd like to learn (may vary per phone but
              routine is similar), then click Refresh :)
            </Text>
            <Button
              title="Close"
              onPress={() => setLanguageModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Speech rate selection modal */}
      <Modal
        visible={rateModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-sky-200 bg-opacity-50">
          <View className="bg-white w-4/5 rounded-lg p-5 max-h-3/4">
            <Text className="text-lg text-[#353535] mb-3">
              Select Speech Rate
            </Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={speechRate}
              onValueChange={(value) => setSpeechRate(value)}
            />
            <Text className="text-base text-[#353535] text-center">
              Rate: {speechRate.toFixed(1)}
            </Text>
            <Button title="Close" onPress={() => setRateModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Level selection modal */}
      <Modal
        visible={levelModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-sky-200 bg-opacity-50">
          <View className="bg-white w-4/5 rounded-lg p-5 max-h-3/4">
            <Text className="text-lg text-[#353535] mb-3">Select Level</Text>
            <ScrollView className="mb-3">
              {levels.map((levelOption) => (
                <TouchableOpacity
                  key={levelOption}
                  onPress={() => {
                    setLevel(levelOption);
                    setLevelModalVisible(false);
                  }}
                  className="p-2"
                >
                  <Text className="text-base text-[#353535]">
                    {levelOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setLevelModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Chatbot;
