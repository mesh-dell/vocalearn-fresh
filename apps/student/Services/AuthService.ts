import axios from "axios";
import { handleError } from "@/Helpers/ErrorHandle";
import { UserProfile, UserProfileToken } from "@/Models/User";

const API_BASE = "http://localhost:8080/student";

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
  admissionYear: string,
  admissionId: string,
  courseName: string,
  gender: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    return await axios.post<UserProfileToken>(`${API_BASE}/auth/register`, {
      email,
      admissionYear,
      admissionId,
      courseName,
      gender,
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

export const completeProfileAPI = async (
  token: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const res = await axios.post<UserProfile>(
      `${API_BASE}/complete/profile`,
      { firstName, lastName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
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
