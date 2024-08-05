import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";

const GoogleSignInButton = ({ onSuccess }) => {
  useEffect(() => {}, []);

  const handleGoogleSignIn = async () => {
    return;
  };

  return (
    <TouchableOpacity onPress={handleGoogleSignIn}>
      <Text className="text-base font-bold text-gray-900">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
