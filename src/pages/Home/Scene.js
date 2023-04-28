import { React } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Spline from "@splinetool/react-spline";
import styled from "styled-components";

const Scene = (props) => {
  const setSceneLoaded = props.setSceneLoaded;
  return (
    <>
      <IntroWrapper>
        <IntroTitle>Explore, Craft, and Trade</IntroTitle>
      </IntroWrapper>
      <Canvas
        camera={{ position: [0, 15, 90] }}
        style={{
          backgroundColor: "rgb(0, 0, 0)",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Stars
          radius={200}
          depth={100}
          count={1000}
          factor={15}
          saturation={1}
          fade
          speed={2}
        />
        <ambientLight intensity={0.1} />
      </Canvas>
      <Spline
        scene="https://prod.spline.design/qOEgWG80rQnifgb4/scene.splinecode"
        style={{
          position: "absolute",
          widhth: "100%",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: "rgb(0,0,0,0)",
        }}
        onLoad={() => setSceneLoaded(true)}
      />
    </>
  );
};

export default Scene;

const IntroWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0);
  z-index: 1;
  color: white;
  font-family: "GalacticFont";
  text-align: center;
`;

const IntroTitle = styled.h1`
  font-size: 2.9vw;
  font-weight: 700;
  letter-spacing: -5px;
  margin-top: 35vh;
`;
