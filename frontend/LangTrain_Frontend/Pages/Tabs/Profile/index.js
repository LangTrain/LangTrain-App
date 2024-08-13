import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../../hooks/AuthProvider";

const Profile = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg">Sign Out Here</Text>
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        className="flex-1 justify-center items-center"
      />
    </View>
  );
};

export default Profile;
