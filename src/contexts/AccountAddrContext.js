// src/contexts/AccountAddressContext.js
import React, { createContext, useContext, useState } from "react";

const AccountAddressContext = createContext();

export const useAccountAddress = () => useContext(AccountAddressContext);

export const AccountAddressProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState(null);

  return (
    <AccountAddressContext.Provider value={{ accountAddress, setAccountAddress }}>
      {children}
    </AccountAddressContext.Provider>
  );
};
