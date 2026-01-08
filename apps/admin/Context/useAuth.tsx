"use client";
import { createContext, useEffect, useState } from "react";
import { UserProfile } from "@/Models/User";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/Services/AuthService";
import { toast } from "react-toastify";
import React from "react";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => void;
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
    const localUser = localStorage.getItem("user");
    const localToken = localStorage.getItem("token");
    if (localUser && localToken) {
      setToken(localToken);
      try {
        setUser(JSON.parse(localUser)); // ✅ parse and restore user
      } catch {
        localStorage.removeItem("user"); // clean if corrupted
      }
    }
    setIsReady(true);
  }, []);

  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then(async (res) => {
        if (res) {
          localStorage.setItem("token", res.data.token);
          const userObj = {
            role: res.data.role,
            emailAddress: res.data.emailAddress,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);
          setToken(res.data.token);
          toast.success("Login Success!");
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

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
