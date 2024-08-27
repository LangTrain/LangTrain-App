import { OPENAI_API_KEY } from "../../../env";
import {
  doc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import axios from "axios";
import firebase from "firebase/app";
import generateSpeech from "./pronounce_vocab";
import getImages from "./get_images";
import * as FileSystem from "expo-file-system";

const fetchVocab = async (topic, difficulty) => {
  console.log("Starting fetchVocab with: ", topic, difficulty);

  console.log("First searching for existing lesson in firestore");
  const lowercasedTopic = topic.toLowerCase();
  const lowercasedDifficulty = difficulty.toLowerCase();

  const lessonsRef = collection(db, "lessons");

  try {
    const q = await query(
      lessonsRef,
      where("topic", "==", lowercasedTopic),
      where("difficulty", "==", lowercasedDifficulty)
    );

    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);

    if (!querySnapshot.empty) {
      const matchingLesson = querySnapshot.docs[0].data();
      console.log("Found existing lesson in firestore: ", matchingLesson);
      return matchingLesson.vocabulary;
    } else {
      console.log("No matching lesson found");
    }
  } catch (e) {
    console.log("Error in fetchVocab: ", e);
    throw e;
  }

  const sysPrompt = `
        You are a mandarin teacher. You take in text from a user and generate a lesson plan based on the user's input. 
        Make sure to create exactly 5 vocabulary for the user to learn based on the ${topic} topic and ${difficulty} difficulty. Also create 1 sentence per vocabulary word and a quiz at the end of the lesson.
        You should return only the vocabulary words, definitions, and pinyin (space between each word), sentence, and quiz in the following JSON format: 
        {
            "vocabulary" : [
              {
                "text": "word1", 
                "definition": "definition1", 
                "pinyin": "pinyin1", 
                "sentence": {
                  "text": "sentence_text1", 
                  "translation": "sentence_translation1", 
                  "pinyin": "sentence_pinyin1"
                }, 
                "quiz":[
                  {
                    "question": "What does word1 mean?", 
                    "options: ["option1", "option2", "option3", "correctOption"], 
                    "correctAnswer": "correctOption"
                  }
                ]
              },
              {
                "text": "word2", 
                "definition": 
                "definition2", 
                "pinyin": "pinyin2", 
                "sentence": {
                  "text": "sentence_text2", 
                  "translation": "sentence_translation2", 
                  "pinyin": "sentence_pinyin2"
                },
                "quiz":[
                  {
                    "question": "What does word2 mean?", 
                    "options: ["option1", "option2", "option3", "correctOption"], 
                    "correctAnswer": "correctOption"
                  }
                ]
              },
              {
                "text": "word3", 
                "definition": "definition3", 
                "pinyin": "pinyin3", 
                "sentence": {
                  "text": "sentence_text3", 
                  "translation": "sentence_translation3", 
                  "pinyin": "sentence_pinyin3"
                },
                "quiz":[
                  {
                    "question": "What does word3 mean?", 
                    "options: ["option1", "option2", "option3", "correctOption"], 
                    "correctAnswer": "correctOption"
                  }
                ]
              },
              {
                "text": "word4", 
                "definition": "definition4", 
                "pinyin": "pinyin4", 
                "sentence": {
                  "text": "sentence_text4",
                  "translation": "sentence_translation4",
                  "pinyin": "sentence_pinyin4"
                }, 
                "quiz":[
                  {
                    "question": "What does word4 mean?", 
                    "options: ["option1", "option2", "option3", "correctOption"], 
                    "correctAnswer": "correctOption"
                  }
                ]
              },
              {
                "text": "word5", 
                "definition": "definition5",  
                "pinyin": "pinyin5", 
                "sentence": {
                  "text": "sentence_text5", 
                  "translation": "sentence_translation5", 
                  "pinyin": "sentence_pinyin5"
                },
                "quiz":[
                  {
                    "question": "What does word5 mean?", 
                    "options: ["option1", "option2", "option3", "correctOption"], 
                    "correctAnswer": "correctOption"
                  }
                ]
              }
            ]
        }
        `;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sysPrompt },
          {
            role: "user",
            content: `Generate a lesson on the topic ${topic} with a ${difficulty} difficulty.`,
          },
        ],
        temperature: 0.6,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log(
      "API response received:",
      response.data.choices[0].message.content
    );

    const parsed_json = JSON.parse(response.data.choices[0].message.content);

    const vocabWithAudioUrls = await Promise.all(
      parsed_json.vocabulary.map(async (vocab) => {
        const wordAudioPath = await generateSpeech(vocab.text);
        const sentenceAudioBase64 = await generateSpeech(vocab.sentence.text);
        const wordImage = await getImages(vocab.definition);
        return {
          ...vocab,
          audioBase64: wordAudioPath,
          image: wordImage,
          sentence: {
            ...vocab.sentence,
            audioBase64: sentenceAudioBase64,
            image: wordImage,
          },
        };
      })
    );
    //save the object as a
    try {
      const toAddCollection = collection(db, "lessons");
      await addDoc(toAddCollection, {
        vocabulary: vocabWithAudioUrls,
        difficulty: lowercasedDifficulty,
        topic: lowercasedTopic,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.log("Error saving lesson to firestore: ", e);
    }

    return vocabWithAudioUrls;
  } catch (error) {
    console.log("Error in fetchVocab: ", error);
    throw error;
  }
};

export default fetchVocab;
