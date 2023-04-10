import { React, useRef, useState } from "react";
import styled from "styled-components";
import Spline from "@splinetool/react-spline";
import PlayerHeader from "./PlayerHeader";
import ResourceDisplay from "./ResourceDisplay";

const Player = (props) => {
  const setSceneLoaded = props.setSceneLoaded;
  const [planetClicked, setPlanetClicked] = useState(false);
  const enterSpaceship = useRef();
  const leaveSpaceship = useRef();
  const enterPlanet = useRef();
  const leavePlanet = useRef();

  function onLoad(spline) {
    enterSpaceship.current = spline.findObjectByName("EnterSpaceship");
    leaveSpaceship.current = spline.findObjectByName("LeaveSpaceship");
    enterPlanet.current = spline.findObjectByName("EnterPlanet");
    leavePlanet.current = spline.findObjectByName("LeavePlanet");
    setSceneLoaded(true);
  }

  return (
    <>
      <Body>
        <PlayerHeader enterSpaceship={enterSpaceship} leaveSpaceship={leaveSpaceship} enterPlanet={enterPlanet} leavePlanet={leavePlanet} setPlanetClicked={setPlanetClicked}/>
        <Spline scene="https://prod.spline.design/iYAOxeIY3PMVRSDv/scene.splinecode" onLoad={onLoad} />
        <ResourceDisplay planetClicked={planetClicked} />
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
`;
