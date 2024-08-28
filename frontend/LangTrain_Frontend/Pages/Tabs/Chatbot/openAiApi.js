// openAiApi.js
import { OPENAI_API_KEY } from "../../../env";
import axios from "axios";

export const fetchOpenAiResponse = async (userMessage, language, level) => {
  console.log("Starting API call with:", userMessage, language, level);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // Replace with your preferred model
        messages: [
          {
            role: "system",
            content: `You are a professional language teacher teaching ${language} to a student at a ${level} level. Please provide the response to the user message in ${language}. Then provide a detailed explanation in English with help with pronounciation. The two responses should always be split into two sections with === in the middle.`,
          },
          { role: "user", content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log("API response received:", response.data);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
