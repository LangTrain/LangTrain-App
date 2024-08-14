import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Community = ({ navigation }) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "channels"));
        const channelsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChannels(channelsList);
      } catch (error) {
        console.error("Error fetching channels: ", error);
      }
    };

    fetchChannels();
  }, []);

  return (
    <View className="flex-1 p-4 bg-[#f0f4f7]">
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-white  rounded-lg shadow-md">
            <View className="items-center">
              <Text className="text-lg font-bold text-[#353535]">
                {item.name}
              </Text>
            </View>
            <Button
              title="Join Channel"
              onPress={() =>
                navigation.navigate("Chat", { channelId: item.id })
              }
              color="#5bc0de"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Community;
