// import { OPENAI_API_KEY } from "../../../env";
// import axios from "axios";
// import * as FileSystem from "expo-file-system";
// import { encode } from "base64-arraybuffer";
// import { GOOGLE_API_KEY } from "../../../env";
// import { v4 as uuidv4 } from "uuid";
// const generateSpeech = async (text) => {
//   const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;

//   console.log("Trying to generate speech for: ", text);

//   try {
//     const response = await axios.post(
//       GOOGLE_TTS_URL,
//       {
//         input: { text },
//         voice: {
//           languageCode: "cmn-CN",
//           name: "cmn-CN-Wavenet-A",
//           ssmlGender: "FEMALE",
//         },
//         audioConfig: {
//           audioEncoding: "MP3",
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const base64Audio = response.data.audioContent;
//     return base64Audio;
//   } catch (e) {
//     console.log("error in generate speech", e);
//   }
// };

// export default generateSpeech;

import * as Speech from "expo-speech";

const generateSpeech = async (text) => {
  console.log("Trying to generate speech for: ", text);

  try {
    // Use Expo Speech module to speak the text
    Speech.speak(text, {
      language: "zh-CN",
      pitch: 1.0,
      rate: 1.0,
    });
  } catch (e) {
    console.log("Error in generating speech", e);
  }
};

export default generateSpeech;
