import { Text, View, Pressable, TextInput } from 'react-native';


export default function QuizLevel({ navigation }) {



  const handlePress = (difficulty) => {
    // Navigate to the quiz screen with the selected difficulty
    navigation.navigate('Quiz', { difficulty, topic:"navigate only difficulty" });
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800 mb-5">📝 Make My Own Quiz</Text>

        <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => navigation.navigate('CreateQuiz')}>
          <Text className="text-white text-lg font-bold">✍️ Create</Text>
        </Pressable>

        <Pressable className="bg-blue-700 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => navigation.navigate('CreatedQuizesList')}>
          <Text className="text-white text-lg font-bold">📚 Quiz library</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-gray-800 mb-5 mt-5">📓 Classic Mode</Text>

        <Pressable className="bg-green-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Easy')}>
          <Text className="text-white text-lg font-bold">👶 Easy</Text>
        </Pressable>

        <Pressable className="bg-yellow-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Medium')}>
          <Text className="text-white text-lg font-bold">🤔 Medium</Text>
        </Pressable>

        <Pressable className="bg-red-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={() => handlePress('Hard')}>
          <Text className="text-white text-lg font-bold">🤯 Hard</Text>
        </Pressable>

        
      </View>
    </View>
  );
}
