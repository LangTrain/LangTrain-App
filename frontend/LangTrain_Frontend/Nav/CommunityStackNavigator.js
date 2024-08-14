// CommunityStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Community from "../Pages/Tabs/Community";
import Chat from "../Pages/Tabs/Community/Chat"; // Import your Chat screen

const Stack = createStackNavigator();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
