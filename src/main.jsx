import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadScript
        googleMapsApiKey="AIzaSyDsdiSyANogur60VuElSVtY_eO0NUhYEqk"
        libraries={libraries}
      >
        <App />
      </LoadScript>
    </AuthProvider>
  </React.StrictMode>
);
