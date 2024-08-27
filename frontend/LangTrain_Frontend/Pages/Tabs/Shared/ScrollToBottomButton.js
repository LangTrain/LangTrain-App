import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Text, Animated } from "react-native";

const ScrollToBottomButton = ({ scrollViewRef, messages, name }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
      setVisible(false); // Hide button after clicking
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setVisible(true); // Show button when new messages arrive
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [messages]);

  return (
    visible && (
      <Animated.View
        className={`${
          name === "community"
            ? "absolute bottom-20 right-4"
            : "absolute bottom-0 right-4"
        }`}
        style={{ opacity: fadeAnim }}
      >
        <TouchableOpacity
          onPress={scrollToBottom}
          className="bg-[#5bc0de] py-2 px-4 rounded-full"
        >
          <Text className="text-white font-bold">↓ Scroll to Bottom</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  );
};

export default ScrollToBottomButton;
