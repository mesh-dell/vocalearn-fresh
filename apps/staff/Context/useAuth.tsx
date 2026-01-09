"use client";
import { createContext, useEffect, useState } from "react";
import { UserProfile } from "@/Models/User";
import { useRouter } from "next/navigation";
import { loginAPI, registerAPI, profileAPI } from "@/Services/AuthService";
import { toast } from "react-toastify";
import React from "react";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
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
    const initializeAuth = async () => {
      const localToken = localStorage.getItem("token");
      const localUser = localStorage.getItem("user");

      if (localToken) {
        setToken(localToken);

        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch {
            localStorage.removeItem("user");
          }
        } else {
          // Fetch from API if user not in localStorage
          await fetchProfile(localToken);
        }
      }
      setIsReady(true);
    };

    initializeAuth();
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
      logout();
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const res = await registerAPI(email, password, confirmPassword);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        await fetchProfile(res.data.token);
        toast.success("Register Success!");
        router.push("/dashboard");
      }
    } catch {
      toast.warning("Server error occurred");
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        await fetchProfile(res.data.token);
        toast.success("Login Success!");
        router.push("/dashboard");
      }
    } catch {
      toast.warning("Server error occurred");
    }
  };

  const isLoggedIn = () => !!user;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
