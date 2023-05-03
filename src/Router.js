import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Player from "./pages/Player/Player";
import Loading from "./Loading";
import GlobalFonts from "./fonts/fonts";
import { useAccountAddress } from "./contexts/AccountAddrContext";
import Galaxy from "./pages/Galaxy/Galaxy";
import { generateStars } from "./pages/Galaxy/generateStars";
import AddData from "./AddData";
import { ethers } from "ethers";

const Router = () => {
  const [userConnect, setUserConnect] = useState(null);
  const [planetID, setPlanetID] = useState("0");
  const [displayGalaxy, setDisplayGalaxy] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { accountAddress, setAccountAddress } = useAccountAddress();
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          const address = accounts[0];
          setAccountAddress(address);
          setUserConnect(true);
          setSceneLoaded(false);
        } else {
          setUserConnect(false);
        }
      }
    };
    checkConnection();
  }, [setUserConnect]);

  return (
    <BrowserRouter>
      <GlobalFonts />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {<Loading sceneLoaded={sceneLoaded} />}
              {userConnect !== null &&
                (userConnect ? (
                  displayGalaxy ? (
                    <Galaxy
                      setDisplayGalaxy={setDisplayGalaxy}
                      setPlanetID={setPlanetID}
                      setSceneLoaded={setSceneLoaded}
                    />
                  ) : (
                    <Player
                      setSceneLoaded={setSceneLoaded}
                      setDisplayGalaxy={setDisplayGalaxy}
                      planetID={planetID}
                    />
                  )
                ) : (
                  <Home
                    setUserConnect={setUserConnect}
                    setSceneLoaded={setSceneLoaded}
                  />
                ))}

              {/*<AddData />*/}
            </>
          }
        />
        <Route path="/add" element={<AddData />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route render={() => <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
