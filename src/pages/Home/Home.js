import { React } from "react";
import styled from "styled-components";
import HomeHeader from "./HomeHeader";
import GlobalFonts from "../../fonts/fonts";
import Scene from "./Scene";

const Home = () => {
  return (
    <>
      <GlobalFonts />
      <Body>
        <HomeHeader />
        <Scene />
      </Body>
    </>
  );
};

export default Home;

const Body = styled.div`
  top: 0;
  position: absolute;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  text-align: center;
  z-index: 0;
`;