import axios from "axios";
import { handleError } from "@/Helpers/ErrorHandle";
import { UserProfile, UserProfileToken } from "../Models/User";

const api = "http://localhost:8080/student/";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "auth/authenticate", {
      email: email,
      password: password,
    });
    return data;
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
    const data = await axios.post<UserProfileToken>(api + "auth/register", {
      email: email,
      admissionYear: admissionYear,
      admissionId: admissionId,
      courseName: courseName,
      gender: gender,
      confirmPassword: confirmPassword,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const profileAPI = async (token: string) => {
  try {
    const res = await axios.get<UserProfile>(api + "get/profile", {
      headers: { Authorization: `Bearer ${token}` },
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
      api + "complete/profile",
      {
        firstName,
        lastName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
