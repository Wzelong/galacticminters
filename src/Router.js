import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Player from "./pages/Player/Player";
import Loading from "./Loading";
import GlobalFonts from "./fonts/fonts";
import { useEtherContext } from "./contexts/EtherContext";
import Galaxy from "./pages/Galaxy/Galaxy";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x77dC9e43FB7f260e37264380B063055B6ba9Cd51";
const abi = [
  "function mintCube(string memory color, string memory material) public",
  "function transferCube(uint256 tokenId) public",
  "function getCubeInfo(uint256 tokenId) public view returns (string memory color, string memory material, address owner)",
];
const Router = () => {
  const [userConnect, setUserConnect] = useState(null);
  const [planetID, setPlanetID] = useState("0");
  const [displayGalaxy, setDisplayGalaxy] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [warning, setWarning] = useState("");
  const {
    accountAddress,
    setAccountAddress,
    setProvider,
    setSigner,
    setContract,
  } = useEtherContext();
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        setWarning("");
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          const address = accounts[0];
          setAccountAddress(address);
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          const contractWithSigner = new ethers.Contract(
            CONTRACT_ADDRESS,
            abi,
            signer
          );
          setContract(contractWithSigner);
          setSigner(signer);
          setUserConnect(true);
          setSceneLoaded(false);
        } else {
          setUserConnect(false);
        }
      } else {
        setWarning("Please install MetaMask");
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
              {<Loading sceneLoaded={sceneLoaded} warning={warning} />}
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
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route render={() => <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
