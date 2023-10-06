import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import RedirectPopupProvider from "./components/Providers/RedirectPopupProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RedirectPopupProvider>
      <App />
    </RedirectPopupProvider>
  </React.StrictMode>
);
