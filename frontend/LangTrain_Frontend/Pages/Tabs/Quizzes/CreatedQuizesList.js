import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, FlatList, Pressable, TextInput } from "react-native";
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const CreatedQuizesList = ({ navigation }) => {
    const [quizMetadata, setQuizMetadata] = useState([]);
    const [filteredMetadata, setFilteredMetadata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState(""); // Track selected difficulty

    useEffect(() => {
        const fetchQuizMetadata = async () => {
            try {
                // Reference to the "GeneratedQuizMetaInfo" collection
                const generatedQuizMetaInfoRef = collection(db, "GeneratedQuizMetaInfo");

                // Fetch all documents in "GeneratedQuizMetaInfo"
                const snapshot = await getDocs(generatedQuizMetaInfoRef);
                const documents = snapshot.docs;

                // Extract topic and difficulty from each document
                const metadata = documents.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        topic: data.topic,
                        topicUpdate: data.topic.replace(/^Level[^-]* - /, ''),
                        difficulty: data.difficulty,
                    };
                });
                
                setQuizMetadata(metadata);
                setFilteredMetadata(metadata);

            } catch (err) {
                setError(err);
                console.error("Error fetching documents:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizMetadata();
    }, []);

    useEffect(() => {
        let filtered = quizMetadata;

        if (query.trim() !== "") {
            filtered = filtered.filter(item =>
                item.topic.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        if (selectedDifficulty) {
            filtered = filtered.filter(item =>
                item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
            );
        }

        setFilteredMetadata(filtered);
    }, [query, selectedDifficulty, quizMetadata]);

    const handleSearch = () => {
        // Simply update the query state to trigger the filtering logic in useEffect
        setQuery(query.trim());
    };

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        // Trigger the filtering logic in useEffect
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading ...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">Error: {error.message}</Text>
            </View>
        );
    }

    // Function to get class names based on difficulty
    const getDifficultyClasses = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'hard':
                return 'bg-red-500';
            default:
                return 'bg-gray-300';
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-50">
            <Text className="text-xl font-bold mb-4">🤖 AI Generated Quiz Sets</Text>
            <View className="flex-row items-center mb-4">
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by topic"
                className="flex-1 p-4 border border-gray-300 rounded-l-lg"
            />
            <Pressable
                onPress={handleSearch}
                className="p-3 bg-blue-500 rounded-r-lg" // Increased padding for a bigger button
            >
                <Text className="text-white font-bold text-lg">🔍</Text> 
            </Pressable>
        </View>
            <View className="flex-row justify-between mb-4">
                <Pressable
                    onPress={() => handleDifficultySelect("easy")}
                    className={`flex-1 p-2 m-1 rounded-lg ${selectedDifficulty === "easy" ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <Text className="text-center text-white font-bold">Easy</Text>
                </Pressable>
                <Pressable
                    onPress={() => handleDifficultySelect("medium")}
                    className={`flex-1 p-2 m-1 rounded-lg ${selectedDifficulty === "medium" ? 'bg-yellow-500' : 'bg-gray-300'}`}
                >
                    <Text className="text-center text-white font-bold">Medium</Text>
                </Pressable>
                <Pressable
                    onPress={() => handleDifficultySelect("hard")}
                    className={`flex-1 p-2 m-1 rounded-lg ${selectedDifficulty === "hard" ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                    <Text className="text-center text-white font-bold">Hard</Text>
                </Pressable>
                <Pressable
                    onPress={() => handleDifficultySelect("")}
                    className={`flex-1 p-2 m-1 rounded-lg ${selectedDifficulty === "" ? 'bg-blue-300' : 'bg-gray-300'}`}
                >
                    <Text className="text-center text-white font-bold">All</Text>
                </Pressable>
            </View>
            {filteredMetadata.length === 0 ? (
                <Text className="text-center text-gray-500">No search results found</Text>
            ) : (
                <FlatList
                    data={filteredMetadata}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="p-4 border-b border-gray-300">
                            <Pressable
                                onPress={() => navigation.navigate("Quiz", { difficulty: item.difficulty, topic: item.topic })}
                                className={`p-4 rounded-lg ${getDifficultyClasses(item.difficulty)}`}
                            >
                                <Text className="text-lg font-bold">{item.topicUpdate}</Text>
                                <Text className="text-md">Difficulty: {item.difficulty}</Text>
                            </Pressable>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default CreatedQuizesList;
