import { createContext, useState, useEffect, ReactNode, useContext } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string | undefined;
  _id: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuthState: (state: {
    isAuthenticated: boolean;
    user: User | null;
  }) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      login(token, user);
    }
    setIsLoading(false); // Đánh dấu đã xử lý xong
  }, []);

  // ✅ Khi component mount, lấy lại `token` và `user` từ `localStorage`
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Lắng nghe thay đổi trong `localStorage` (trường hợp có nhiều tab hoặc OAuth redirect)
  useEffect(() => {
    const syncAuth = () => {
      const newToken = localStorage.getItem("token");
      const newUser = localStorage.getItem("user");

      if (newToken && newUser) {
        setToken(newToken);
        setUser(JSON.parse(newUser));
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("Logout successfully");
  };

  const setAuthState = (state: {
    isAuthenticated: boolean;
    user: User | null;
  }) => {
    setIsAuthenticated(state.isAuthenticated);
    setUser(state.user);

    if (state.isAuthenticated && state.user) {
      localStorage.setItem("token", state.user.email);
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        setAuthState,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
