import React from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../Components/CustomButton";
import { useAuth } from "../../hooks/AuthProvider.tsx";

const EmailVerification = ({ navigation }) => {
  const { resendVerificationEmail } = useAuth();

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail();
      Alert.alert("Success", "Verification email resent successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="items-center p-4">
          <View className="w-full h-56 mt-4 rounded-2xl overflow-hidden">
            <Image
              source={require("../../assets/langtrain-bg.png")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                borderRadius: 66,
              }}
            />
          </View>
          <Text className="text-4xl font-bold text-center mt-4">
            Check your Email!
          </Text>
          <Text className="text-lg text-center mt-2">
            We sent a verification link to your email.
          </Text>
          <View className="mt-8 items-center">
            <Text className="text-center">
              Didn't receive the email? Check your spam folder or
            </Text>

            <CustomButton
              title="Resend Email"
              handlePress={handleResendEmail}
              containerStyles="mt-4 w-full max-w-xs"
            />

            <Text className="mt-4 text-center">Email Verified? Go back to</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="font-bold text-lg text-blue-500 }">
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailVerification;
