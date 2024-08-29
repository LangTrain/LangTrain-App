import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Ionicons } from '@expo/vector-icons';
import pic from "../../../assets/quiz/mistakes.png";

export default MyMistakes = () => {
    const [displayName, setDisplayName] = useState(() => {
        return auth.currentUser
          ? auth.currentUser.displayName || "Unknown User"
          : "Unknown User";
    });

    const [userMistakes, setUserMistakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                setLoading(true);
                const userEmail = auth.currentUser?.email;
                const mistakesQuery = query(
                    collection(db, 'userMistakes'),
                    where('userEmail', '==', userEmail)
                );
                const querySnapshot = await getDocs(mistakesQuery);
                const mistakesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    mistakes: doc.data().mistakes
                }));
                setUserMistakes(mistakesData);
            } catch (e) {
                console.error("Error fetching mistakes: ", e);
            } finally {
                setLoading(false);
            }
        };

        fetchMistakes();
    }, []);

    const handleDeleteMistake = async (docId, mistake) => {
        try {
            setDeleting(true);
            const docRef = doc(db, 'userMistakes', docId);
            await updateDoc(docRef, {
                mistakes: arrayRemove(mistake)
            });

            // Fetch the document again to check if the array is empty
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const remainingMistakes = docSnapshot.data().mistakes;
                if (remainingMistakes.length === 0) {
                    await deleteDoc(docRef);
                }
            }

            // Update state to remove the deleted mistake
            setUserMistakes(prevMistakes => 
                prevMistakes.map(mistakesItem => 
                    mistakesItem.id === docId
                    ? {
                        ...mistakesItem,
                        mistakes: mistakesItem.mistakes.filter(m => m.question !== mistake.question)
                    }
                    : mistakesItem
                ).filter(mistakesItem => mistakesItem.mistakes.length > 0)
            );
        } catch (e) {
            console.error("Error deleting mistake: ", e);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-4 text-lg">Loading mistakes...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            {deleting && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-50 justify-center items-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="mt-4 text-lg text-white">Deleting mistake...</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-2xl font-bold mb-5">🛠️ My Mistakes</Text>
                {userMistakes.length === 0 ? (
                    <View>
                        
                        <Text className="text-lg text-gray-500">No mistakes found.</Text>
                        
                    </View>
                    
                ) : ( 
                    userMistakes.map(({ id, mistakes }) => (
                        mistakes.map((mistake, index) => (
                            <View key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
                                <View className="flex flex-row justify-between items-center">
                                    <Text className="text-lg font-semibold mb-2">Question:</Text>
                                    <TouchableOpacity onPress={() => handleDeleteMistake(id, mistake)}>
                                        <Ionicons name="trash" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-gray-700 mb-2">{mistake.question}</Text>
                                <Text className="text-red-500 mb-2">Your Answer: {mistake.selectedAnswer}</Text>
                                <Text className="text-green-500">Correct Answer: {mistake.correctAnswer}</Text>
                            </View>
                        ))
                    ))
                    
                    
                )}

                <Image
                    source={pic}
                    className="w-11/12 h-44 self-center"
                    style={{ resizeMode: 'contain' }}
                />
                
                
            </ScrollView>
            
        </View>
    );
};
