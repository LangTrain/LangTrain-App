import { View, TextInput, Text, Pressable, ActivityIndicator } from "react-native";
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import generateQuiz from "./OpenAICreateQuizAPI";

export default CreateQuiz = ({ navigation }) => {
    const [input, setInput] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        console.log("Topic:", input);
        console.log("Difficulty:", difficulty);
        let updateInput = `Level ${difficulty} - ${input}`;
        setLoading(true);
        const response = await generateQuiz(updateInput, difficulty);

        setLoading(false);

        if (response.status === "success") {
            // Navigate to QuizPage and pass quiz data as parameters
            navigation.navigate('Quiz', {topic: updateInput});
        } else {
            // Handle error (e.g., show an alert)
            console.error(response.message);
        }
    };

    return (
        <View className="p-4 flex-1 justify-center items-center">
            {
                loading ?  (   
                <>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="items-centered mt-4 text-lg font-bold text-black-700">Loading...</Text>
                </>
            
            ) : (
                    <>
                    <Text className="text-2xl font-bold text-gray-800 mb-5 mt-3">
                        Create Your Own Quiz!
                    </Text>

                    {/* Topic Title */}
                    <Text className="text-lg font-semibold text-gray-700 mb-2">
                        Topics
                    </Text>
                    <TextInput
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base mb-4"
                        value={input}
                        onChangeText={setInput}
                        placeholder="Search your Topics ..."
                    />

                    {/* Difficulty Title */}
                    <Text className="text-lg font-semibold text-gray-700">
                        Difficulty
                    </Text>
                    <View className="w-full border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={difficulty}
                            onValueChange={(itemValue) => setDifficulty(itemValue)}
                        >
                            <Picker.Item label="Easy" value="easy" />
                            <Picker.Item label="Medium" value="medium" />
                            <Picker.Item label="Hard" value="hard" />
                        </Picker>
                    </View>

                    {/* Centered Submit Button */}
                    <View className="items-center">
                        <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={handleSubmit}>
                            <Text className="text-white text-lg font-bold">Submit!</Text>
                        </Pressable>
                    </View>
                    </>
                )
            }
            
        </View>
    );
};
