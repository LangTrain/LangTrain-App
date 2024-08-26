import { OPENAI_API_KEY } from "../../../env";
import axios from "axios";
import { db } from '../../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const generateQuiz = async (topic, difficulty, language = "mandarin", amount = 5) => {
    // Firestore reference for the normalized topic
    const quizCollectionRefOriginalMatch = collection(db, "quizBank", "CreatedQuiz", topic);
    const generatedQuizSetsRef = collection(db, "GeneratedQuizMetaInfo"); // New collection reference

    // Check if the topic already exists in Firestore
    const exist1 = await getDocs(quizCollectionRefOriginalMatch);

    if (!exist1.empty) {
        // console.log(`Topic "${topic}" already exists in the database.`);
        return {status: "success", message: `Topic "${topic}" already exists in the database.`};
    }

    // If the topic doesn't exist, proceed with generating the quiz
    const sysPrompt = `You are a ${language} teacher. You take in text from a user and generate quiz questions.
    based on the instructions I provide now. I will give you the return format and what to return when encountering errors.
    Your task is to create ${amount} quiz questions in ${language} about the topic ${topic} at a ${difficulty} difficulty level.
    If there is an error, please only return "Error" as a response string.
    If there is no error, you should return the below JSON format:
    {
        "createdQuiz": [ 
            {
                "question": "generated question 1",
                "options": [
                    "generated option 1",
                    "generated option 2",
                    "generated option 3",
                    "generated option 4"
                ],
                "correctAnswer": "correct answer for this question" 
            },
            {
                "question": "generated question 2",
                "options": [
                    "generated option 1",
                    "generated option 2",
                    "generated option 3",
                    "generated option 4"
                ],
                "correctAnswer": "correct answer for this question" 
            }
        ]
    }`;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: sysPrompt },
                    {
                        role: "user",
                        content: `Generate ${amount} quiz questions in the language of ${language} on the topic ${topic} with a ${difficulty} difficulty.`,
                    },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const content = response.data.choices[0].message.content;
        // console.log("API response received:", content);

        let parsedJson;
        try {
            parsedJson = JSON.parse(content);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            return {status: "Error", message: parseError};
        }

        const quizData = parsedJson.createdQuiz;
        // console.log(quizData);

        // Firestore: Add the quiz data to Firestore under the topic
        const addQuizToFirestore = async () => {
            for (let quiz of quizData) {
                await addDoc(quizCollectionRefOriginalMatch, quiz);
            }
        };

        await addQuizToFirestore();
        // console.log(`Quiz questions added to Firestore under the topic: ${topic}`);

        // Add metadata to "GeneratedQuizSets"
        const generatedQuizMetadata = {
            topic,
            difficulty,
            language,
            amount,
            timestamp: new Date(),
        };

        await addDoc(generatedQuizSetsRef, generatedQuizMetadata);
        // console.log(`Quiz metadata added to Firestore under "GeneratedQuizSets"`);

        return {status:"success", message:`Quiz questions added to Firestore under the topic: ${topic}`};

    } catch (e) {
        console.error("API call failed:", e);
        return {status: "Error", message: e};
    }
};

export default generateQuiz;
