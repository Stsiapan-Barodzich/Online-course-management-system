import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import "./index.css";

console.log('Приложение запущено!')
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </StrictMode>
);
