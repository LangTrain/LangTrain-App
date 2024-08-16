import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
// import questionBank from '../../questionBank';
import { useRoute } from '@react-navigation/native';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
/**
 * You can access this actuaL Quiz page by pressing 
 * the "Quiz time" button in login page.
 * 
 * All the pages are added to stack screens.
 * On the result screen, you can go back to Login,
 * since there's no button to move in chat bot screen
 * 
 * I store the questionBank.js under root directory which store all the questions
 * Later I would need to connect with firebase for real questions and a lot more 
 * faeture impovement 
 * 
 * 1) every time you open the quiz, it should be different sets of questions
 * 2) after the quiz in the result screen, add button to view all mistakes VS answers
 * 3) change all styles to nativeWind
 */


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

    // fetch proper difficulty as needed
    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const quizQuestionCollectionRef = collection(db, 'quizBank', difficulty, 'quizQuestion');
            const querySnapshot = await getDocs(quizQuestionCollectionRef);
            const questions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            }));

            // console.log(questions)
            setQuestionBank(questions)

            // load in the first question on the screen
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
        
    }

    useEffect(() => {
        if(questionBank){
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
    }, [])

    const handleOptionPress = (option) => {
        // console.log(`Selected option: ${option}`);
        setSelected(option);
        setCorrect(option === curAns);
        if (firstSel) {
            if (option === curAns) {
                setScore(score + 1);
            }
        }
        setFirstSel(false);
    };

    const handleNext = () => {
        if (!selected) {
            return;
        }

        if ((index + 1) < questionBank.length) {
            setIndex(index + 1);
            setCorrect(null);
            setSelected(null);
            setFirstSel(true);
        } else {
            setIndex(0);
            setCorrect(null);
            setSelected(null);
            setFirstSel(true);
            navigation.navigate('Result', { score, totalQuestions: questionBank.length });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{difficulty} Mode</Text>
            {
                loading ? (<View><Text>loading</Text></View>) :(
                    <>
                        <Text style={styles.question}>{curQues}</Text>
            
                        <View style={styles.optionsContainer}>
                            {curOptions.map((op, idx) => (
                                <Pressable 
                                    key={idx} 
                                    style={[
                                        styles.optionButton, 
                                        (selected === op && correct) && styles.correctButton,
                                        (selected === op && !correct) && styles.incorrectButton,
                                        { opacity: (selected === op) ? 0.5 : 1 }
                                    ]}
                                    onPress={() => handleOptionPress(op)}
                                >
                                    <Text style={styles.optionText}>{op}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )
            }
            

            <Pressable style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.nextButtonPressed
            ]} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                    Next
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    question: {
        fontSize: 22,
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    optionButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
    },
    optionButtonPressed: {
        backgroundColor: '#0056b3',
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    correctButton: {
        backgroundColor: 'green',
    },
    incorrectButton: {
        backgroundColor: 'red',
    },
    nextButton: {
        backgroundColor: 'gray',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonPressed: {
        backgroundColor: '#218838',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
