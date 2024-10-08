import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ScoreReport = ({ navigation }) => {
    const route = useRoute();
    const { score, attemptID, topic, difficulty } = route.params;

    const [mistakes, setMistakes] = useState([]);

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                const docRef = doc(db, 'attemptHistory', attemptID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMistakes(docSnap.data().attempts || []);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            }
        };

        fetchMistakes();
    }, [attemptID]);

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            <Text className="text-3xl font-bold text-gray-800 mb-4 mt-4 text-center">Score Report</Text>
            <ScrollView>
                {mistakes.length === 0 ? (
                    <Text className="text-lg text-gray-600 text-center">Loading ...</Text>
                ) : (
                    mistakes.map((mistake, index) => (
                        <View key={index} className="mb-4 p-3 bg-white rounded-lg shadow">
                            <Text className="text-lg font-bold mb-2">Question {index + 1}:</Text>
                            <Text className="text-md text-gray-700 mb-1">Question: {mistake.question}</Text>
                            <Text className="text-md text-gray-700 mb-1">Your Answer: {mistake.selected}</Text>
                            <Text className={`text-md ${mistake.answer === mistake.selected ? 'text-green-500' : 'text-red-500'}`}>
                                Correct Answer: {mistake.answer}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <View className="flex-row justify-between mt-4 mb-5 px-4">
                <Pressable className="bg-blue-500 py-3 px-6 rounded-md items-center flex-1 mr-2" onPress={() => navigation.navigate('QuizLevel')}>
                    <Text className="text-white text-lg font-bold">Back</Text>
                </Pressable>

                <Pressable className="bg-green-500 py-3 px-6 rounded-md items-center flex-1" onPress={() => navigation.navigate('Quiz', {topic, difficulty})}>
                    <Text className="text-white text-lg font-bold">Practice Again</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default ScoreReport;
