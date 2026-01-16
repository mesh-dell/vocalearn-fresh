"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { UserProfile } from "@/Models/User";
import {
  loginAPI,
  registerAPI,
  profileAPI,
} from "@/Services/AuthService";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
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
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsReady(true);
        return;
      }

      setToken(storedToken);

      try {
        const profile = await profileAPI(storedToken);
        if (!profile) throw new Error();

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch {
        logout();
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* HELPERS */
  /* ------------------------------------------------------------------------ */

  const saveSession = (token: string, user: UserProfile) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  /* ------------------------------------------------------------------------ */
  /* ACTIONS */
  /* ------------------------------------------------------------------------ */

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      if (!res?.data?.token) return;

      const profile = await profileAPI(res.data.token);
      if (!profile) return;

      saveSession(res.data.token, profile);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch {
      toast.error("Login failed");
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      const res = await registerAPI(email, password, confirmPassword);
      if (!res?.data?.token) return;

      const profile = await profileAPI(res.data.token);
      if (!profile) return;

      saveSession(res.data.token, profile);
      toast.success("Registration successful");
      router.push("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    router.replace("/");
  };

  /* ------------------------------------------------------------------------ */
  /* PROVIDER */
  /* ------------------------------------------------------------------------ */

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/* HOOK */
/* -------------------------------------------------------------------------- */

export const useAuth = () => useContext(UserContext);

