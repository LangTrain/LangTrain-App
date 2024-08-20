import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../Pages/HomeScreen";
import Profile from "../Pages/Tabs/Profile";
import Quizzes from "../Pages/Tabs/Quizzes";
import Lessons from "../Pages/Tabs/Lessons";
import CommunityStackNavigator from "./CommunityStackNavigator";
import QuizStackNavigator from "./QuizStackNavigator";

const Tab = createBottomTabNavigator();
const tabScreens = [
  {
    name: "LangTrain",
    component: HomeScreen,
    label: "LangTrain",
    icon: "owl",
    show: true,
  },

  {
    name: "Lessons",
    component: Lessons,
    label: "Lessons",
    icon: "school",
    show: true,
  },
  {
    name: "Quizzes",
    component: QuizStackNavigator,
    label: "Quizzes",
    icon: "all-inclusive-box",
    show: true,
  },
  {
    name: "Community_",
    component: CommunityStackNavigator,
    label: "Community",
    icon: "chat-processing",
    show: false,
  },
  {
    name: "Profile",
    component: Profile,
    label: "Profile",
    icon: "account",
    show: true,
  },
  // Add more screens here as needed
];

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      {tabScreens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: screen.label,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={screen.icon}
                color={color}
                size={size}
              />
            ),
            headerShown: screen.show,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
export default BottomTabsNavigator;
