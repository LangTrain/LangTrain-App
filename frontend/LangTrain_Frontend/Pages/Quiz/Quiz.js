import { Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Quiz({ navigation }) {
    const route = useRoute();
    const { difficulty } = route.params;

    const [index, setIndex] = useState(0);
    const [curQues, setCurQues] = useState('');
    const [curOptions, setCurOptions] = useState([]);
    const [curAns, setCurAns] = useState('');
    const [correct, setCorrect] = useState(null);
    const [selected, setSelected] = useState(null);
    const [firstSel, setFirstSel] = useState(true);
    const [score, setScore] = useState(0);

    const [questionBank, setQuestionBank] = useState(null);
    const [loading, setLoading] = useState(false);

    const [attemptHistory, setAttempHistory] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const quizQuestionCollectionRef = collection(db, 'quizBank', difficulty, 'quizQuestion');
            const querySnapshot = await getDocs(quizQuestionCollectionRef);
            let questions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            questions = shuffleArray(questions);
            // console.log(questions);
            setQuestionBank(questions);

            let ques = questions[0].question;
            setCurQues(ques);
            let options = questions[0].options;
            setCurOptions(options);
            let ans = questions[0].correctAnswer;
            setCurAns(ans);

        } catch (e) {
            console.error("Error fetching quiz data: ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (questionBank) {
            let ques = questionBank[index].question;
            setCurQues(ques);
            let options = questionBank[index].options;
            setCurOptions(options);
            let ans = questionBank[index].correctAnswer;
            setCurAns(ans);
        }
    }, [index]);

    useEffect(() => {
        fetchQuestion();
    }, []);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleOptionPress = (option) => {
        setSelected(option);
        setCorrect(option === curAns);
        // if we are making our first choice, we update our score and 
        // add to our attempt history
        if (firstSel) {
            if (option === curAns) {
                setScore(score + 1);
            }
            let attempt = {
                "question": curQues,
                "answer": curAns,
                "selected": option,
            }

            setAttempHistory([
                ...attemptHistory,
                attempt
            ])
        }
        setFirstSel(false);
    };

    const handleNext = async () => {
        if (!selected) {
            return;
        }
    
        if ((index + 1) < questionBank.length) {
            setIndex(index + 1);
            setCorrect(null);
            setSelected(null);
            setFirstSel(true);
        } else {
            const docId = await uploadAttemptHistory();
            navigation.navigate('Result', {
                score,
                totalQuestions: questionBank.length,
                attemptID: docId
            });
    
            setIndex(0);
            setCorrect(null);
            setSelected(null);
            setFirstSel(true);
            setAttempHistory([]);
        }
    };
    
    const uploadAttemptHistory = async () => {
        setSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, 'attemptHistory'), {
                attempts: attemptHistory,
                timestamp: new Date(),
            });
            return docRef.id;
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setSubmitting(false);
        }
    };
    

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-5">
            {loading ? (
                <View className="flex-1 justify-center items-center bg-gray-100">
                    <Text className="text-2xl font-bold text-gray-800 mb-5">{difficulty} Mode</Text>
                    <Text className="text-xl font-bold text-gray-800">Loading...</Text>
                </View>
            ) : submitting ? (
                <View className="flex-1 justify-center items-center bg-gray-100">
                    <Text className="text-xl font-bold text-gray-800">Submitting...</Text>
                </View>
            ) : (
                <>
                    <Text className="text-2xl font-bold text-gray-800 mb-5">{difficulty} Mode</Text>

                    <Text className="text-xl text-gray-700 mb-5 text-center">{curQues}</Text>

                    <View className="w-full items-center">
                        {curOptions.map((op, idx) => (
                            <Pressable 
                                key={idx} 
                                className={`bg-blue-500 py-3 px-6 rounded-lg my-2 w-4/5 items-center ${selected === op && correct ? 'bg-green-500' : ''} ${selected === op && !correct ? 'bg-red-500' : ''}`}
                                onPress={() => handleOptionPress(op)}
                                style={{ opacity: selected === op ? 0.5 : 1 }}
                            >
                                <Text className="text-white text-lg font-bold">{op}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable 
                        className="bg-gray-500 py-3 px-6 rounded-lg mt-5 w-3/5 items-center justify-center"
                        onPress={handleNext}
                    >
                        <Text className="text-white text-lg font-bold">Next</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}
