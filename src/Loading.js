import { React, useState } from "react";
import styled from "styled-components";
import logo from "./images/PlayerHomeLogo.png";

const Loading = (props) => {
  return (
    <LoadingWrapper loadingPercentage={props.loadingPercentage}>
      <Logo src={logo} />
      <LoadingText>Loading... {props.loadingPercentage}%</LoadingText>
    </LoadingWrapper>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 100vh;
  display: ${(props) => (props.loadingPercentage === 100 ? "none" : "flex")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: #000000;
  color: #ffffff;
  font-family: "GalacticFont";
`;

const LoadingText = styled.h1`
  font-size: 1.5vw;
  margin-top: 3vh;
  font-weight: 300;
`;

const Logo = styled.img`
  width: 5vw;
`;
