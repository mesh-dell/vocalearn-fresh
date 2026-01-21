import axios from "axios";
import { handleError } from "@/Helpers/ErrorHandle";
import { UserProfile, UserProfileToken } from "@/Models/User";

const API_BASE = "http://localhost:8080/staff";

export const loginAPI = async (email: string, password: string) => {
  try {
    return await axios.post<UserProfileToken>(`${API_BASE}/auth/authenticate`, {
      email,
      password,
    });
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    return await axios.post<UserProfileToken>(`${API_BASE}/auth/register`, {
      email,
      password,
      confirmPassword,
    });
  } catch (error) {
    handleError(error);
  }
};

export const profileAPI = async (token: string) => {
  try {
    const res = await axios.get<UserProfile>(`${API_BASE}/get/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const forgotPasswordAPI = async (email: string) => {
  try {
    return await axios.post(`${API_BASE}/forgot`, { email });
  } catch (error) {
    handleError(error);
  }
};

export const resetPasswordAPI = async (token: string, newPassword: string) => {
  try {
    return await axios.post(`${API_BASE}/reset`, { token, newPassword });
  } catch (error) {
    handleError(error);
  }
};
