"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { UserProfile } from "@/Models/User";
import {
  loginAPI,
  registerAPI,
  profileAPI,
  completeProfileAPI,
} from "@/Services/AuthService";
import { awardPoints } from "@/Services/GamifyService";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    email: string,
    admissionYear: string,
    admissionId: string,
    courseName: string,
    gender: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  completeUserProfile: (firstName: string, lastName: string) => Promise<void>;
  isLoggedIn: boolean;
};

type Props = {
  children: React.ReactNode;
};
const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsReady(true);
        return;
      }

      setToken(storedToken);

      try {
        const profile = await loadProfile(storedToken);

        if (!profile) {
          logout();
        }
      } finally {
        setIsReady(true);
      }
    };

    hydrateAuth();
  }, []);

  const loadProfile = async (token: string) => {
    try {
      const profile = await profileAPI(token);
      if (!profile) return;

      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch {
      toast.warning("Failed to load profile");
    }
  };

  const saveSession = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      if (!res) return;

      saveSession(res.data.token);

      const profile = await loadProfile(res.data.token);
      if (!profile) return;

      toast.success("Login successful!");

      await awardPoints("LOGIN", profile.admissionId, profile.lastName);

      router.push("/dashboard");
    } catch {
      toast.error("Login failed");
    }
  };

  const registerUser = async (
    email: string,
    admissionYear: string,
    admissionId: string,
    courseName: string,
    gender: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const res = await registerAPI(
        email,
        admissionYear,
        admissionId,
        courseName,
        gender,
        password,
        confirmPassword
      );

      if (!res) return;

      saveSession(res.data.token);
      await loadProfile(res.data.token);

      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  };

  const completeUserProfile = async (firstName: string, lastName: string) => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      await completeProfileAPI(token, firstName, lastName);
      await loadProfile(token);

      toast.success("Profile completed!");
      router.push("/dashboard/profile");
    } catch {
      toast.error("Failed to complete profile");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    router.push("/");
  };
  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        logout,
        completeUserProfile,
        isLoggedIn: isReady && !!user,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
