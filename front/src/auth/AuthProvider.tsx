import { createContext, useContext, useEffect } from "react";
import { useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (token: string, userlogin: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userlogin)); // ✅ Asegura que se guarde como string JSON
    setToken(token);
    setUser(userlogin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return loading ? null : (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
