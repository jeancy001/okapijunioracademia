import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { API_URL } from "../constants/Api";

// ------------------- Types -------------------
export interface User {
  id: string;
  username: string;
  role: "admin" | "teacher" | "student";
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
 register: (username: string, email: string, password: string) => Promise<User>; // return User
  logout: () => Promise<void>;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

// Extend AxiosRequestConfig to include _retry
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

// ------------------- Context -------------------
const AuthContext = createContext<UserContextType | undefined>(undefined);

// ------------------- Axios Instance -------------------
const api = axios.create({
  baseURL: API_URL || "/api",
  withCredentials: true, // send HttpOnly cookies
});

// ------------------- Provider -------------------
export const AuthProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);

  // ------------------- Fetch Profile -------------------
  const fetchProfile = async () => {
    try {
      const res = await api.get<User>("/auth/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Fetch profile failed:", err);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
    else setLoading(false);
  }, [token]);

  // ------------------- Login -------------------
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token); // store token for socket usage
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      const error = err as AxiosError;
      throw error.response?.data || { message: "Login failed" };
    }
  };


  //register

// ------------------- Register -------------------
const register = async (username: string, email: string, password: string) => {
  try {
    const res = await api.post<{ user: User; token: string }>("/auth/register", {
      username,
      email,
      password,
    });

    const { user: newUser, token: newToken } = res.data;

    // Set state and localStorage
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("token", newToken);

    return newUser; // optional: return user data
  } catch (err: unknown) {
    // Clear state and token on failure
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");

    // Determine error message
    let message = "Registration failed";
    if (err && typeof err === "object") {
      const axiosError = err as AxiosError<{ message: string }>;
      message = axiosError.response?.data?.message || axiosError.message || message;
    }

    // Throw standardized error object
    throw { message };
  }
};


  // ------------------- Logout -------------------
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // ------------------- Refresh Token -------------------
  const refreshToken = async () => {
    try {
      const res = await api.get("/auth/refresh-token");
      if (res.status === 200) {
        await fetchProfile();
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // ------------------- Axios Interceptor -------------------
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfigWithRetry;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshToken();
            return api(originalRequest); // retry original request
          } catch {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// ------------------- Custom Hook -------------------
export const useAuth = (): UserContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
