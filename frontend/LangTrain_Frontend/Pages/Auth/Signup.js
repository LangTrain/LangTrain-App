// SignupScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../hooks/AuthProvider";
import GoogleSignInButton from "../../Components/GoogleSignIn";
import FormInput from "../../Components/FormInput";

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await signUp(form.email, form.password);
      Alert.alert("User registered successfully!");
      navigation.navigate("EmailVerification");
    } catch (error) {
      Alert.alert(error.message);
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
            Get started for free
          </Text>
          <Text className="text-lg text-center mt-2">
            No credit card required.
          </Text>
          <FormInput
            title="Email"
            value={form.email}
            otherStyles={{ marginTop: 16 }}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />
          <FormInput
            title="Password"
            value={form.password}
            otherStyles={{ marginTop: 16 }}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry
          />
          <FormInput
            title="Confirm Password"
            value={form.confirmPassword}
            otherStyles={{ marginTop: 16 }}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-blue-500 rounded-xl h-12 justify-center items-center w-full max-w-xs mt-4"
            onPress={handleSignUp}
          >
            <Text className="text-white text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 rounded-xl h-12 flex-row justify-center items-center w-full max-w-xs mt-4">
            <Image
              source={require("../../assets/google_icon.webp")}
              className="w-5 h-5 mr-2"
            />
            <GoogleSignInButton onSuccess={() => navigation.navigate("Home")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-lg text-blue-500 mt-2">
              Already have an account? Log in.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
