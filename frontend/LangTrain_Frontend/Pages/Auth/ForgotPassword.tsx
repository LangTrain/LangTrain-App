// screens/ForgotPassword.tsx
import React, { useState } from "react";
import { Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../Components/CustomButton.tsx";
import FormInput from "../../Components/FormInput.tsx";
import { useAuth } from "../../hooks/AuthProvider.tsx";

const ForgotPassword: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword(email);
      Alert.alert("Success", "Email sent successfully");
      navigation.navigate("Login");
    } catch (e: any) {
      Alert.alert("Error", e.message);
      console.log(e);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="h-full">
        <View className="items-center">
          <FormInput
            title="Forgot your password?"
            placeholder="Enter Email Address Here"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles="mt-8"
          />
          <CustomButton
            title="Send Password Reset link"
            containerStyles="w-5/6 mt-8"
            handlePress={handleSubmit}
          />
        </View>
        <View className="mt-8 ml-8">
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-lg font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
