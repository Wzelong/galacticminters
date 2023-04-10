import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Player from "./pages/Player/Player";
import Loading from "./Loading";
import GlobalFonts from "./fonts/fonts";


const Router = () => {
  const [userConnect, setUserConnect] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setUserConnect(true);
        } else {
          setUserConnect(false);
        }
      }
    };
    checkConnection();
  }, [setUserConnect]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercentage((prevPercentage) => {
        if (prevPercentage < 100) {
          return prevPercentage + 1;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <GlobalFonts />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Loading loadingPercentage={loadingPercentage} />
              {userConnect ? (<Player setSceneLoaded={setSceneLoaded} />) : (<Home setUserConnect={setUserConnect} setSceneLoaded={setSceneLoaded}/>)}
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route render={() => <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
