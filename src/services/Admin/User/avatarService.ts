import api from "../../api";
import { User } from "./userService";

export const uploadAvatar = async (userId: string, file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.put(`v1/users/avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};