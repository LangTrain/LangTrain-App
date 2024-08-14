import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { db, auth } from "../../../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const Chat = ({ route }) => {
  const { channelId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "channels", channelId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => doc.data());
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [channelId]);

  const handleSend = async () => {
    if (messageText.trim() === "") return;

    try {
      await addDoc(collection(db, "channels", channelId, "messages"), {
        text: messageText,
        sender: auth.currentUser.email,
        timestamp: new Date(),
      });
      setMessageText("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <View className="flex-1 p-4 bg-[#f0f4f7]">
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            className={`mb-2 p-4 rounded-lg ${
              item.sender === auth.currentUser.email
                ? "bg-[#e0f0ff] self-end"
                : "bg-white self-start"
            }`}
          >
            <Text className="text-[#353535]">
              {item.sender}: {item.text}
            </Text>
          </View>
        )}
      />
      <View className="flex-row items-center border-t border-[#ccc] p-2 bg-white">
        <TextInput
          className="flex-1 border border-[#ccc] rounded-md p-2 mr-2"
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} color="#5bc0de" />
      </View>
    </View>
  );
};

export default Chat;
