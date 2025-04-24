import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { CheckAuthResponse, User } from "../types/auth";
import { AuthApi } from "../api/authService";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loginWithTokensAndUser: (data: CheckAuthResponse) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [user, setUser] = useState<User | null>(null);
  const hasLoggedOut = useRef(false); // ✅ Ajout d’un flag pour éviter relogin après logout

  const isAuthenticated = !!accessToken && !!user;

  const loginWithTokensAndUser = (data: CheckAuthResponse) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser({
      id: data.id,
      nom: data.nom,
      email: data.email,
      role: data.role,
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    hasLoggedOut.current = false; // ✅ Réinitialise le flag après login
  };

  const logout = useCallback(() => {
    if (user?.email) {
      AuthApi.logout({ email: user.email });
    }
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    hasLoggedOut.current = true; // ✅ Active le flag pour bloquer checkTokens
  }, [user]);

  useEffect(() => {
    const checkTokens = async () => {
      if (!accessToken || !refreshToken || hasLoggedOut.current) return;
      try {
        const { data } = await AuthApi.checkAuth({ accessToken, refreshToken });
        loginWithTokensAndUser(data);
      } catch {
        logout();
      }
    };
    checkTokens();
  }, [accessToken, refreshToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        loginWithTokensAndUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
