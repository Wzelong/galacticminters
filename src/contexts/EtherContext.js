// src/contexts/EtherContext.js
import React, { createContext, useContext, useState } from "react";

const EtherContext = createContext();

export const useEtherContext = () => useContext(EtherContext);

export const EtherProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  return (
    <EtherContext.Provider
      value={{
        accountAddress,
        setAccountAddress,
        signer,
        setSigner,
        provider,
        setProvider,
        contract,
        setContract,
      }}
    >
      {children}
    </EtherContext.Provider>
  );
};
