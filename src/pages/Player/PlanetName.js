import { React } from "react";
import styled from "styled-components";

const PlanetName = (props) => {
  const showPlanetName = props.showPlanetName;
  return (
    <>
      <PlanetNameWrapper showPlanetName={showPlanetName}>
        Silicon
      </PlanetNameWrapper>
    </>
  );
};

export default PlanetName;

const PlanetNameWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  left: 45vw;
  top: 75%;
  width: 10vw;
  height: 5vh;
  font-family: "GalacticFont";
  color: white;
  opacity: ${(props) => (props.showPlanetName ? "0.6" : "0")};
  transition: opacity 1s ease-in-out;
  z-index: 2;
  font-size: 1.5vw;
`;
