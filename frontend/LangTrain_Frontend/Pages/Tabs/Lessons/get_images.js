import { PEXELS_API_KEY } from "../../../env";
import axios from "axios";

const getImages = async (word) => {
  console.log("Trying to get image for: ", word);
  try {
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${word}&per_page=1`;

    const response = await axios.get(pexelsUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    console.log("Response: ", response.data);
    if (response.data.photos.length > 0) {
      const imageUrl = response.data.photos[0].src.medium;
      console.log("Image URL: ", imageUrl);
      return imageUrl;
    }
  } catch (e) {
    console.error("Failed to get image for word: ", word);
  }
};

export default getImages;
