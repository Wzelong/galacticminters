import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { EtherProvider } from "./contexts/EtherContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EtherProvider>
      <Router />
    </EtherProvider>
  </React.StrictMode>
);
