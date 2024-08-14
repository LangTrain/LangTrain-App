import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../Pages/HomeScreen";
import Community from "../Pages/Tabs/Community";
import Profile from "../Pages/Tabs/Profile";
import Quizzes from "../Pages/Tabs/Quizzes";
import Lessons from "../Pages/Tabs/Lessons";

const Tab = createBottomTabNavigator();
const tabScreens = [
  {
    name: "LangTrain",
    component: HomeScreen,
    label: "LangTrain",
    icon: "owl",
  },

  {
    name: "Lessons",
    component: Lessons,
    label: "Lessons",
    icon: "school",
  },
  {
    name: "Quizzes",
    component: Quizzes,
    label: "Quizzes",
    icon: "all-inclusive-box",
  },
  {
    name: "Community",
    component: Community,
    label: "Community",
    icon: "chat-processing",
  },
  {
    name: "Profile",
    component: Profile,
    label: "Profile",
    icon: "account",
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
            headerShown: false,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
export default BottomTabsNavigator;
