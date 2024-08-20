import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuizLevel from "../Pages/Tabs/Quizzes/index";
import Quiz from "../Pages/Tabs/Quizzes/Quiz";
import Result from "../Pages/Tabs/Quizzes/Result";
import ScoreReport from "../Pages/Tabs/Quizzes/ScoreReport";

const Stack = createStackNavigator();

const QuizStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizLevel" component={QuizLevel} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="ScoreReport" component={ScoreReport} />
    </Stack.Navigator>
  );
};

export default QuizStackNavigator;
