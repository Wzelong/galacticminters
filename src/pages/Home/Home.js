import { React } from "react";
import styled from "styled-components";
import HomeHeader from "./HomeHeader";
import Scene from "./Scene";

const Home = (props) => {
  return (
    <>
      <Body>
        <HomeHeader setUserConnect={props.setUserConnect}/>
        <Scene setSceneLoaded={props.setSceneLoaded} />
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