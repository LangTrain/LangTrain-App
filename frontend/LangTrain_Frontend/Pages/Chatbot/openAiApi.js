// openAiApi.js
import { OPENAI_API_KEY } from "../../env";
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
            content: `You are a professional language teacher teaching ${language} to a student at a ${level} level. Always reply in the ${language} even if student speaks to you in another language.`,
          },
          { role: "user", content: userMessage },
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

    console.log("API response received:", response.data);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
