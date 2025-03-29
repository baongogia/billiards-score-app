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
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("v1/users/find");
    console.log("API Response:", response.data.data); // Log để kiểm tra
    const data = response.data as { data: User[] };
    console.log("Get user success");
    return data.data; // Return the data without filtering
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchManagersWithoutStore = async (): Promise<User[]> => {
  try {
    const response = await api.get("v1/stores/user/withoutStore");
    const data = response.data as { data: User[] };
    console.log("Get managers without store success");
    return data.data.filter(user => user.role === "manager" && user.status === "active");
  } catch (error) {
    console.error("Error fetching managers without store:", error);
    throw error;
  }
};

export const fetchUserProfile = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`v1/users/${id}`);
    console.log("Get profile success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchUserProfileByEmail = async (email: string): Promise<User> => {
  try {
    const response = await api.get(`v1/users/email/${email}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateAdmin = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`v1/users/admin/${id}`, userData);
    console.log("Update success");
    return response.data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`v1/users/${id}`, userData);
    console.log("Update success");
    return response.data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updatePassword = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`v1/users/${id}`, userData);
    console.log("Update success");
    return response.data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`v1/users/${id}`);
    console.log("Delete user success");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const registerUser = async (formData: {
  email: string;
  otp: string;
  name: string;
  password: string;
  phone: string;
  role: string;
}): Promise<void> => {
  try {
    await api.post("v1/auth/register", formData);
    console.error("register success");
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const sendOtp = async (email: string): Promise<void> => {
  await api.get(`/v1/mail/send-otp?email=${email}`);
  console.log("Send OTP success");
};

export const fetchInactiveUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<{ data: User[] }>("v1/users/inactive");
    console.log("Get inactive user success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inactive users:", error);
    throw error;
  }
};


export const fetchFilteredUsers = async (
  term?: string,
  role?: string,
  status?: string,
  current?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: string
): Promise<{
  length: number; data: {data:User[]}; pagination: { totalItem: number }
}> => {
  try {
    const params = new URLSearchParams();
    if (term) params.append('term', term);
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    if (current) params.append('current', current.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDirection) params.append('sortDirection', sortDirection);

    const response = await api.get(`v1/users/search?${params.toString()}`);
    console.log("API Response:", response.data); // Thêm log để kiểm tra response

    return {
      length: response.data.data?.length || 0,
      data: response.data.data || [],
      pagination: {
        totalItem: response.data.pagination?.totalItem || 0
      }
    };
  } catch (error) {
    console.error("Error fetching filtered users:", error);
    throw error;
  }
};

interface ChangePasswordData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (userId: string, data: ChangePasswordData) => {
  console.log('Changing password for user:', userId); // Debug log
  const response = await api.put(`/v1/users/change-password/${userId}`, data);
  return response.data;
};