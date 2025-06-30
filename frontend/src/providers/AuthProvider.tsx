import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AuthContext, type User } from "../contexts/AuthContext";
import { logout as apiLogout } from "../services/authService";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionnel : appel à /me
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
