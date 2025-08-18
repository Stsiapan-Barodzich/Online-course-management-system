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

  const loginUser = async (username, password) => {
    const response = await fetch("http://localhost:8000/api/v1/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data);
      setUser(JSON.parse(atob(data.access.split(".")[1])));
      localStorage.setItem("authTokens", JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const updateAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = { ...authTokens, access: data.access };
        setAuthTokens(newTokens);
        setUser(JSON.parse(atob(data.access.split(".")[1])));
        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        return data.access;
      } else {
        logoutUser();
        return null;
      }
    } catch (error) {
      logoutUser();
      return null;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!authTokens) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/token/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authTokens.access }),
      });

      if (response.ok) {
        setUser(JSON.parse(atob(authTokens.access.split(".")[1])));
      } else {
        await updateAccessToken();
      }

      setLoading(false);
    };

    verifyToken();
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