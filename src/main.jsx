import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import SystemCrash from "./components/os/SystemCrash.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SystemCrash>
      {/* The Safety Net */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </SystemCrash>
  </React.StrictMode>,
);
