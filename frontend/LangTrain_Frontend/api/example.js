import axios from "axios";

const updateProfile = async (userId, updateData) => {
  try {
    const response = await axios.post(
      "http://your-django-server-url/update_user/",
      {
        user_id: userId,
        update_data: updateData,
      }
    );
    if (response.status === 200) {
      console.log("Profile updated successfully:", response.data);
    } else {
      console.error("Failed to update profile:", response.data);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

export { updateProfile };
