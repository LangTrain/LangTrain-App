import { View, Text, Pressable, ActivityIndicator, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState } from 'react';
import generateQuiz from "./OpenAICreateQuizAPI";
import { Picker } from '@react-native-picker/picker';

const CreateQuiz = ({ navigation }) => {
    const [input, setInput] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [count, setCount] = useState("5"); // Default count value
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // console.log("Topic:", input);
        // console.log("Difficulty:", difficulty);
        // console.log("Count:", count);
        let updateInput = `Level ${difficulty} - ${input}`;
        setLoading(true);
        const response = await generateQuiz(updateInput, difficulty, parseInt(count)); // Pass count as number

        setLoading(false);

        if (response.status === "success") {
            // Navigate to QuizPage and pass quiz data as parameters
            navigation.navigate('Quiz', { topic: updateInput });
        } else {
            // Handle error (e.g., show an alert)
            console.error(response.message);
        }
    };

    // Function to get background color based on count
    const getCountBackgroundColor = (selectedCount) => {
        switch (selectedCount) {
            case "3":
                return 'bg-green-500'; // Green for 3
            case "5":
                return 'bg-yellow-500'; // Yellow for 5
            case "10":
                return 'bg-red-500'; // Red for 10
            default:
                return 'bg-gray-300'; // Gray for unselected
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                {
                    loading ? (
                        <View className="flex-1 justify-center items-center bg-gray-100 p-4">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text className="mt-4 text-xl font-bold text-gray-800">
                                Loading...
                            </Text>
                            <Text className="mt-2 text-base text-gray-600 text-center">
                                It may take up to 20-30 seconds for the quiz to be generated. 
                                Please wait patiently.
                            </Text>
                        </View>
                    ) : (
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-gray-800 mb-5 mt-3 text-center">
                                Create Your Own Quiz!
                            </Text>

                            {/* Topic Title */}
                            <Text className="text-2xl font-semibold text-gray-700 mb-2">
                                Topics
                            </Text>
                            <TextInput
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base mb-4"
                                value={input}
                                onChangeText={setInput}
                                placeholder="Search your Topics ..."
                            />

                            {/* Difficulty Title */}
                            <Text className="text-2xl font-semibold text-gray-700 mb-2">
                                Difficulty
                            </Text>
                            <View className="w-full border border-gray-300 rounded-lg mb-4">
                                <Picker
                                    selectedValue={difficulty}
                                    onValueChange={(itemValue) => setDifficulty(itemValue)}
                                    className="h-32"
                                >
                                    <Picker.Item label="Easy" value="easy" />
                                    <Picker.Item label="Medium" value="medium" />
                                    <Picker.Item label="Hard" value="hard" />
                                </Picker>
                            </View>

                            {/* Count Title */}
                            <Text className="text-2xl font-semibold text-gray-700 mb-2">
                                Number of Questions
                            </Text>
                            <View className="w-full flex-row justify-between mb-4">
                                <TouchableOpacity
                                    onPress={() => setCount("3")}
                                    className={`flex-1 p-4 m-1 rounded-lg ${getCountBackgroundColor(count === "3" ? "3" : "")}`}
                                >
                                    <Text className="text-center text-white font-bold text-2xl">3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setCount("5")}
                                    className={`flex-1 p-4 m-1 rounded-lg ${getCountBackgroundColor(count === "5" ? "5" : "")}`}
                                >
                                    <Text className="text-center text-white font-bold text-2xl">5</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setCount("10")}
                                    className={`flex-1 p-4 m-1 rounded-lg ${getCountBackgroundColor(count === "10" ? "10" : "")}`}
                                >
                                    <Text className="text-center text-white font-bold text-2xl">10</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Centered Submit Button */}
                            <Pressable className="bg-blue-500 py-4 px-8 rounded-md my-2 w-4/5 items-center" onPress={handleSubmit}>
                                <Text className="text-white text-lg font-bold">Submit!</Text>
                            </Pressable>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    );
};

export default CreateQuiz;
