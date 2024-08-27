import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import BottomTabsNavigator from "./BottomTabsNavigator";
import { useAuth } from "../hooks/AuthProvider";
import LessonWrapper from "../Pages/Tabs/Lessons/lesson_components/LessonWrapper";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentUser } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          <>
            <Stack.Screen name="HomeScreen" component={BottomTabsNavigator} />
            <Stack.Screen name="LessonWrapper" component={LessonWrapper} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
