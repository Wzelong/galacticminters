import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AccountAddressProvider } from "./contexts/AccountAddrContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AccountAddressProvider>
      <Router />
    </AccountAddressProvider>
  </React.StrictMode>
);
