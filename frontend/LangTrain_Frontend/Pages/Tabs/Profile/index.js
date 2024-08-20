"use client";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../../hooks/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../../Components/CustomButton";

const Profile = () => {
  const { signOut } = useAuth();

  const accountName = "John Doe";

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="flex w-full flex-col h-screen">
        <View className="flex-1">
          <View className="w-full items-center mt-8">
            <Text className="text-xl">Account</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-gray-200 w-full mt-8 min-h-1/6"
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">Profile Picture</Text>
              <View className="flex flex-row justify-end items-center my-auto">
                <Text>Image Goes Here</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          <View className="w-full flex my-auto py-4 min-h-1/6 flex-row justify-between">
            <Text className="ml-8">Account</Text>
            <Text className="mr-8">{accountName}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full min-h-1/6 bg-gray-200"
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">Nickname</Text>
              <View className="flex flex-row items-center justify-end my-auto">
                <Text>Curr Username</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full min-h-1/6 bg-gray-200"
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">First Name</Text>
              <View className="flex flex-row items-center justify-end my-auto">
                <Text>Curr First Name</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full min-h-1/6 bg-gray-200"
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">Last Name</Text>
              <View className="flex flex-row items-center justify-end my-auto">
                <Text>Curr Last Name</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-full flex mt-8 mb-8 flex-row items-center justify-center">
          <CustomButton
            title="Sign Out"
            containerStyles="w-1/2"
            textStyles="items-center justify-center py-2"
            handlePress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
