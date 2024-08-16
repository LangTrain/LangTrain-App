import { View, Text, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Result({ navigation }) {
    const route = useRoute();
    const { score, totalQuestions, attemptID } = route.params;
    
    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-5">
            <Text className="text-4xl font-bold text-gray-800 mb-5">Quiz Results</Text>
            <Text className="text-2xl text-gray-600 mb-5">
                You scored {score} out of {totalQuestions}!
            </Text>

            {/* back to log in for now*/}
            <Pressable className="bg-blue-500 py-3 px-6 rounded-md mt-5 w-3/5 items-center justify-center" onPress={() => navigation.navigate('Login')}>
                <Text className="text-white text-lg font-bold">Back to Home</Text>
            </Pressable>

            <Pressable className="bg-blue-500 py-3 px-6 rounded-md mt-5 w-3/5 items-center justify-center" 
                onPress={() => navigation.navigate('ScoreReport', { 
                    score, 
                    attemptID
             })}>
                <Text className="text-white text-lg font-bold">View Score Report</Text>
            </Pressable>
        </View>
    );
}
