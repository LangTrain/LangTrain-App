"use client";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useAuth } from "../../../hooks/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../../Components/CustomButton";
import { db, auth, storage } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

const Profile = () => {
  const { signOut } = useAuth();

  // State to toggle editing
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  // State to store input values
  const [displayName, setDisplayName] = useState(
    auth.currentUser.displayName || "Unknown User"
  );
  const [profileImage, setProfileImage] = useState("");

  const accountName = auth.currentUser.email;
  const emailVerified = auth.currentUser.emailVerified;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        let profileImageUrl = auth.currentUser.photoURL;

        if (!profileImageUrl) {
          // If the user's photoURL does not exist, use the default image in Firebase Storage
          const storageRef = ref(storage, "user.png");
          profileImageUrl = await getDownloadURL(storageRef);
        }

        setProfileImage(profileImageUrl); // Set the download URL to the state
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  const handleSelectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 1,
      });

      console.log("Image Picker Result:", result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.error(
          "Image picking was cancelled or did not return a valid URI."
        );
        return;
      }

      const uri = result.assets[0].uri; // Access the URI from the assets array
      console.log("Selected image URI:", uri);

      // Resize the image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 160, height: 160 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      console.log("Manipulated image URI:", manipResult.uri);

      // Upload the resized image to Firebase Storage
      const storageRef = ref(
        storage,
        `profileImages/${auth.currentUser.uid}.png`
      );

      // Delete the previous image (optional, since we're overwriting)
      try {
        await deleteObject(storageRef);
      } catch (error) {
        // It's okay if the previous image doesn't exist
        console.log("No previous image to delete, or deletion failed:", error);
      }

      // Upload the new image
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the download URL after uploading
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);

      // Update user's profile with the new photo URL
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      console.log("Profile image updated successfully");
    } catch (error) {
      console.error("Error in handleSelectImage:", error);
    }
  };

  const handleSaveDisplayName = () => {
    updateProfile(auth.currentUser, { displayName: displayName })
      .then(() => {
        console.log("Display name updated successfully");
        setIsEditingDisplayName(false);
      })
      .catch((error) => {
        console.error("Error updating display name:", error);
      });
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="flex w-full flex-col h-screen">
        <View className="flex-1">
          <View className="w-full items-center mt-8"></View>

          {/* Profile Picture Section */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-gray-200 w-full mt-8 min-h-1/6"
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity onPress={handleSelectImage}>
                <Image
                  className="w-32 h-32 border-r-1"
                  source={{ uri: profileImage }}
                />
              </TouchableOpacity>
              <Text className="mt-1 text-xl">Profile Picture</Text>
            </View>
          </TouchableOpacity>

          {/* Account Name Section */}
          <View className="w-full flex my-auto py-4 min-h-1/6 flex-row justify-between">
            <Text className="ml-8">Account</Text>
            <Text className="mr-8">{accountName}</Text>
          </View>

          {/* Nickname Section */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full min-h-1/6 bg-gray-200"
            onPress={() => setIsEditingDisplayName(!isEditingDisplayName)}
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">Nickname</Text>
              <View className="flex flex-row items-center justify-end my-auto">
                {isEditingDisplayName ? (
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter new nickname"
                    className="border p-2"
                    onBlur={handleSaveDisplayName}
                  />
                ) : (
                  <Text>{displayName}</Text>
                )}
                <MaterialCommunityIcons name="chevron-right" size={24} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Email Verified Section */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full min-h-1/6 bg-gray-200"
          >
            <View className="w-full flex py-4 flex-row justify-between items-center">
              <Text className="ml-8 my-auto">Verified Email</Text>
              <View className="flex flex-row items-center justify-end my-auto">
                <Text className="right-4">
                  {`${emailVerified}`.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
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
