import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8000";

  const fetchUserData = async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/me/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUser(data); // user.role будет здесь
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  const loginUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;

      const tokens = await res.json();
      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));

      // Подгружаем пользователя
      await fetchUserData(tokens.access);

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const updateAccessToken = async () => {
    if (!authTokens?.refresh) return null;
    try {
      const res = await fetch(`${API_BASE}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      const newTokens = { ...authTokens, access: data.access };
      setAuthTokens(newTokens);
      localStorage.setItem("authTokens", JSON.stringify(newTokens));

      // Обновляем user через /me/
      await fetchUserData(newTokens.access);

      return data.access;
    } catch (err) {
      console.error(err);
      logoutUser();
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (authTokens?.access) {
        try {
          // Проверяем валидность токена
          const res = await fetch(`${API_BASE}/api/token/verify/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: authTokens.access }),
          });
          if (res.ok) {
            await fetchUserData(authTokens.access);
          } else {
            await updateAccessToken();
          }
        } catch (err) {
          console.error(err);
          logoutUser();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        loginUser,
        logoutUser,
        updateAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
