import { React, useState } from "react";
import styled from "styled-components";

const Loading = (props) => {
  return (
    <LoadingWrapper loadingPercentage={props.loadingPercentage}>
      <h1>Loading...</h1>
      <LoadingText>{props.loadingPercentage}%</LoadingText>
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

const LoadingText = styled.h2`
  font-family: "Playfair Display", serif;
`;