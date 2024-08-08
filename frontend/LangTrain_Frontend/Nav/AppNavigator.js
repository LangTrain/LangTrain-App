import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Pages/Auth/Login";
import SignupScreen from "../Pages/Auth/Signup";
import HomeScreen from "../Pages/HomeScreen";
import EmailVerification from "../Pages/Auth/EmailVerfication";
import ForgotPassword from "../Pages/Auth/ForgotPassword.tsx";
import QuizLevel from "../Pages/Quiz/QuizLevel";
import Quiz from "../Pages/Quiz/Quiz";
import Result from "../Pages/Quiz/Result";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizLevel"
          component={QuizLevel}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
