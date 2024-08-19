import { Text, View, Pressable } from 'react-native';

export default function QuizLevel({ navigation }) {

  const handlePress = (difficulty) => {
    // Navigate to the quiz screen with the selected difficulty
    navigation.navigate('Quiz', { difficulty });
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800 mb-5">Choose the Difficulty</Text>

        <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Easy')}>
          <Text className="text-white text-lg font-bold">Easy</Text>
        </Pressable>

        <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Medium')}>
          <Text className="text-white text-lg font-bold">Medium</Text>
        </Pressable>

        <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Hard')}>
          <Text className="text-white text-lg font-bold">Hard</Text>
        </Pressable>
      </View>
    </View>
  );
}
