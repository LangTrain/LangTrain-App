// LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useAuth } from "../../hooks/AuthProvider.tsx";
import GoogleSignInButton from "../../Components/GoogleSignIn";
import FormInput from "../../Components/FormInput";

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    try {
      await signIn("email", { email: form.email, password: form.password });
      Alert.alert("User signed in successfully!");
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
            Welcome back
          </Text>
          <FormInput
            title="Email"
            value={form.email}
            otherStyles="mt-4"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />
          <FormInput
            title="Password"
            value={form.password}
            otherStyles="mt-4"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-lg text-gray-600 mt-2">Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 rounded-xl h-12 justify-center items-center w-full max-w-xs mt-4"
            onPress={handleSignIn}
          >
            <Text className="text-white text-lg font-bold">Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 rounded-xl h-12 flex-row justify-center items-center w-full max-w-xs mt-4">
            <Image
              source={require("../../assets/google_icon.webp")}
              className="w-5 h-5 mr-2"
            />
            <GoogleSignInButton onSuccess={() => navigation.navigate("Home")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="text-lg text-blue-500 mt-2">
              New user? Sign Up
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
