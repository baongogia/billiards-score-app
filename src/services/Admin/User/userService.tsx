import api from "../../api";

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  status: string;
  avatar?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("v1/users/find");
    const data = response.data as { data: User[] };
    return data.data.filter(user => (user.role === "manager" || user.role === "admin") && user.status === "active");
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchMember = async (): Promise<User[]> => {
  try {
    const response = await api.get("v1/users/find");
    const data = response.data as { data: User[] };
    return data.data.filter(user => user.role === "user" && user.status === "active");
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchManagersWithoutStore = async (): Promise<User[]> => {
  try {
    const response = await api.get("v1/stores?action=findManagersWithoutStore");
    const data = response.data as { data: User[] };
    return data.data.filter(user => user.role === "manager" && user.status === "active");
  } catch (error) {
    console.error("Error fetching managers without store:", error);
    throw error;
  }
};

export const fetchUserProfile = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`v1/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`v1/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};