import { React } from "react";
import styled from "styled-components";
import HomeHeader from "./HomeHeader";
import GlobalFonts from "../../fonts/fonts";

const Home = () => {
  return (
    <>
      <GlobalFonts />
      <Body>
        <HomeHeader />
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
  background-color: #000;
`;