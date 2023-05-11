import { React, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Spline from "@splinetool/react-spline";
import PlayerHeader from "./PlayerHeader";
import ResourceDisplay from "./ResourceDisplay";
import CubeDisplay from "./CubeDisplay";
import PlanetName from "./PlanetName";
import MarketDisplay from "./MarketDisplay";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Player = (props) => {
  const { setSceneLoaded, setDisplayGalaxy, planetID } = props;
  const [planetData, setPlanetData] = useState(null);
  const [planetClicked, setPlanetClicked] = useState(false);
  const [cubeClicked, setCubeClicked] = useState(false);
  const [marketClicked, setMarketClicked] = useState(false);
  const [showPlanetName, setShowPlanetName] = useState(true);
  const [render, setRender] = useState("");
  const enterSpaceship = useRef();
  const enterPlanet = useRef();
  const enterCube = useRef();
  const enterMarket = useRef();
  const leave = useRef();

  function onLoad(spline) {
    enterSpaceship.current = spline.findObjectByName("EnterSpaceship");
    enterPlanet.current = spline.findObjectByName("EnterPlanet");
    enterCube.current = spline.findObjectByName("EnterCube");
    enterMarket.current = spline.findObjectByName("EnterMarket");
    leave.current = spline.findObjectByName("Leave");
    setSceneLoaded(true);
  }

  useEffect(() => {
    getPlanet();
  }, [planetID]);

  const getPlanet = async () => {
    const planetRef = doc(db, "planets", planetID);
    const planetSnap = await getDoc(planetRef);
    if (planetSnap.exists()) {
      setPlanetData(planetSnap.data());
    }
  };

  return (
    <>
      <Body>
        <PlayerHeader
          enterSpaceship={enterSpaceship}
          enterPlanet={enterPlanet}
          enterCube={enterCube}
          enterMarket={enterMarket}
          leave={leave}
          setPlanetClicked={setPlanetClicked}
          setCubeClicked={setCubeClicked}
          setMarketClicked={setMarketClicked}
          setShowPlanetName={setShowPlanetName}
          setRender={setRender}
          setDisplayGalaxy={setDisplayGalaxy}
        />
        {planetData && <Spline scene={planetData.scene} onLoad={onLoad} />}
        {render === "planet" && (
          <ResourceDisplay
            planetClicked={planetClicked}
            planetData={planetData}
          />
        )}
        {render === "cube" && <CubeDisplay cubeClicked={cubeClicked} />}
        {render === "market" && <MarketDisplay marketClicked={marketClicked} />}
        {planetData && (
          <PlanetName showPlanetName={showPlanetName} name={planetData.name} />
        )}
      </Body>
    </>
  );
};

export default Player;

const Body = styled.div`
  top: 0;
  position: absolute;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  text-align: center;
  z-index: 0;
  text-align: center;
`;
