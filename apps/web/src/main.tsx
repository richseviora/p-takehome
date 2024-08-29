import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CssBaseline } from "@mui/material";

// Enables all debugging display in console by default. For dev inclusion only.
// These entries all show up on verbose logging, so make sure you enable that
// in console.
if (import.meta.env.DEV) {
  localStorage.debug = "*";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
);
