import { useCallback } from "react";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL =  "http://localhost:8000"; 

export function useAuthFetch() {
  const { authTokens, logout } = useAuth();

  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!authTokens) {
        throw new Error("No auth token available");
      }

      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${authTokens.access}`,
      };

      const fullUrl = `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`;

      const response = await fetch(fullUrl, { ...options, headers });

      if (response.status === 401) {
        logout();
        window.location.href = "/login";
        throw new Error("Unauthorized - please login again");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Network response error");
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response.json();
      }

      return response.text(); 
    },
    [authTokens, logout]
  );

  return authFetch;
}