import { React } from "react";
import styled from "styled-components";
import logo from "./images/PlayerHomeLogo.png";

const Loading = (props) => {
  return (
    <LoadingWrapper sceneLoaded={props.sceneLoaded}>
      <Logo src={logo} />
    </LoadingWrapper>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 100vh;
  display: ${(props) => (props.sceneLoaded ? "none" : "flex")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: #000000;
  color: #ffffff;
  font-family: "GalacticFont";
`;

const Logo = styled.img`
  width: 5vw;
`;
