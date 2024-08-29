// CommunityStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Lessons from "../Pages/Tabs/Lessons";
import LessonWrapper from "../Pages/Tabs/Lessons/lesson_components/LessonWrapper";

const Stack = createStackNavigator();

const LessonsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lessons" component={Lessons} />
      <Stack.Screen
        name="LessonWrapper"
        component={LessonWrapper}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LessonsNavigator;
