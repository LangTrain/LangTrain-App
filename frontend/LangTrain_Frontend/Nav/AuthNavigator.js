import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Pages/Auth/Login";
import SignupScreen from "../Pages/Auth/Signup";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import EmailVerification from "../Pages/Auth/EmailVerfication";

const pages = [
  { name: "Login", component: LoginScreen },
  { name: "Signup", component: SignupScreen },
  { name: "ForgotPassword", component: ForgotPassword },
  { name: "EmailVerification", component: EmailVerification },
];

const Stack = createStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {pages.map((pages, index) => (
        <Stack.Screen
          key={index}
          name={pages.name}
          component={pages.component}
          options={{ headerShown: false }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
