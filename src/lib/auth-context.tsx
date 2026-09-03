import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as api from "./api";
import { clearToken, getToken, setToken } from "./auth-storage";

interface AuthContextValue {
  user: api.User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "buyer" | "seller",
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .getCurrentUser()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user, token } = await api.login({ email, password });
    setToken(token);
    setUser(user);
  }

  async function signup(name: string, email: string, password: string, role: "buyer" | "seller") {
    const { user, token } = await api.signup({ name, email, password, role });
    setToken(token);
    setUser(user);
  }

  function logout() {
    clearToken();
    setUser(null);
    api.logout().catch(() => {
      // Best-effort — the local token/state is already cleared either way.
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
