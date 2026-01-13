"use client";
import { createContext, useEffect, useState } from "react";
import { UserProfile } from "@/Models/User";
import { useRouter } from "next/navigation";
import {
  loginAPI,
  registerAPI,
  profileAPI,
  completeProfileAPI,
} from "@/Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import { awardPoints } from "@/Services/GamifyService";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => void;
  registerUser: (
    email: string,
    admissionYear: string,
    admissionId: string,
    courseName: string,
    gender: string,
    password: string,
    confirmPassword: string,
  ) => void;
  logout: () => void;
  completeUserProfile: (firstName: string, lastName: string) => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const localToken = localStorage.getItem("token");
    if (localUser && localToken) {
      setToken(localToken);
      fetchProfile(localToken);
    }
    setIsReady(true);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const profile = await profileAPI(token);
      if (profile) {
        localStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);
      }
    } catch {
      toast.warning("Failed to fetch profile");
    }
  };

  const registerUser = async (
    email: string,
    admissionYear: string,
    admissionId: string,
    courseName: string,
    gender: string,
    password: string,
    confirmPassword: string,
  ) => {
    await registerAPI(
      email,
      admissionYear,
      admissionId,
      courseName,
      gender,
      password,
      confirmPassword,
    )
      .then(async (res) => {
        if (res) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          await fetchProfile(res.data.token);
          toast.success("Register Success!");
          router.push("/dashboard");
        }
      })
      .catch(() => toast.warning("Server error occurred"));
  };

  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then(async (res) => {
        if (res) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          await fetchProfile(res.data.token);
          toast.success("Login Success!");
          if (!user) {
            console.log("no user");
            return;
          }
          await awardPoints("LOGIN", user.admissionId, user.lastName)
          router.push("/dashboard");
        }
      })
      .catch(() => toast.warning("Server error occurred"));
  };

  const isLoggedIn = () => !!user;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  const completeUserProfile = async (firstName: string, lastName: string) => {
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }
    try {
      await completeProfileAPI(token, firstName, lastName);
      await fetchProfile(token);
      toast.success("Profile completed successfully!");
      router.push("/dashboard/profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete profile");
    }
  };
  return (
    <UserContext.Provider
      value={{
        loginUser,
        user,
        token,
        logout,
        isLoggedIn,
        registerUser,
        completeUserProfile,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
