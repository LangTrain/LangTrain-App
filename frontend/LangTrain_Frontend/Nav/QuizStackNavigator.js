import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuizLevel from "../Pages/Tabs/Quizzes/index";
import Quiz from "../Pages/Tabs/Quizzes/Quiz";
import Result from "../Pages/Tabs/Quizzes/Result";
import ScoreReport from "../Pages/Tabs/Quizzes/ScoreReport";
import CreateQuiz from "../Pages/Tabs/Quizzes/CreateQuiz";
import CreatedQuizesList from "../Pages/Tabs/Quizzes/CreatedQuizesList";
import MyMistakes from "../Pages/Tabs/Quizzes/MyMistakes";

const Stack = createStackNavigator();

const QuizStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizLevel" component={QuizLevel} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="ScoreReport" component={ScoreReport} />
      <Stack.Screen name="CreateQuiz" component={CreateQuiz}/>
      <Stack.Screen name="CreatedQuizesList" component={CreatedQuizesList}/>
      <Stack.Screen name="MyMistakes" component={MyMistakes}/>
    </Stack.Navigator>
  );
};

export default QuizStackNavigator;
