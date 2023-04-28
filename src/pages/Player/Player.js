import { React, useRef, useState } from "react";
import styled from "styled-components";
import Spline from "@splinetool/react-spline";
import PlayerHeader from "./PlayerHeader";
import ResourceDisplay from "./ResourceDisplay";
import CubeDisplay from "./CubeDisplay";
import PlanetName from "./PlanetName";
import MarketDisplay from "./MarketDisplay";

const Player = (props) => {
  const setSceneLoaded = props.setSceneLoaded;
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
        />
        <Spline
          scene="https://prod.spline.design/iYAOxeIY3PMVRSDv/scene.splinecode"
          onLoad={onLoad}
        />
        {render === "planet" && (
          <ResourceDisplay planetClicked={planetClicked} />
        )}
        {render === "cube" && <CubeDisplay cubeClicked={cubeClicked} />}
        {render === "market" && <MarketDisplay marketClicked={marketClicked} />}
        <PlanetName showPlanetName={showPlanetName} />
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
