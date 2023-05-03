import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { ForkOutlined, LoadingOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAccountAddress } from "../../contexts/AccountAddrContext";

const ResourceDisplay = (props) => {
  const { accountAddress } = useAccountAddress();
  const planetData = props.planetData;
  const [opacity, setOpacity] = useState(0);
  const [owned, setOwned] = useState(false);

  const addResource = async () => {
    const ref = doc(
      db,
      "players",
      accountAddress,
      "resources",
      planetData.id.toString()
    );
    await setDoc(ref, planetData.material);
    getResource();
  };

  const getResource = async () => {
    const ref = doc(
      db,
      "players",
      accountAddress,
      "resources",
      planetData.id.toString()
    );
    const docSnap = await getDoc(ref);
    setOwned(docSnap.exists());
  };

  useEffect(() => {
    if (props.planetClicked) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
    getResource();
  }, [props.planetClicked]);

  return (
    <>
      <ResourceWrapper opacity={opacity}>
        <StyledSlider>
          <Slide>
            <MaterialName>{planetData.material.symbol}</MaterialName>
            <MaterialImg src={planetData.material.image} />
            {owned ? (
              <OwnedText>Owned</OwnedText>
            ) : (
              <StyledFork onClick={addResource} />
            )}
          </Slide>
          <Slide>
            <PlanetDescription>
              <h2>Planet {planetData.name}</h2>
              <ul
                style={{
                  textAlign: "left",
                  textTransform: "uppercase",
                  lineHeight: "29px",
                }}
              >
                <li>Geography: {planetData.info.geography}</li>
                <li>Meteorology: {planetData.info.meteorology}</li>
                <li>Biology: {planetData.info.biology}</li>
                <li>Civilization: {planetData.info.civilization}</li>
              </ul>
            </PlanetDescription>
          </Slide>
        </StyledSlider>
      </ResourceWrapper>
    </>
  );
};

export default ResourceDisplay;

const ResourceWrapper = styled.div`
  position: absolute;
  background-color: transparent;
  left: 5vw;
  top: 15%;
  height: 80%;
  width: 40%;
  opacity: ${(props) => props.opacity};
  display: block;
  border: 2.5px solid black;
  border-radius: 15px;
  transition: opacity 0.5s ease-in-out;
  color: white;
`;

const MaterialImg = styled.img`
  width: 100%;
`;

const MaterialName = styled.div`
  font-family: "GalacticFont";
  font-size: 2vw;
  cursor: default;
  color: white;
  z-index: 3;
  transform: translateY(60px);
  height: 5px;
  margin-top: 5vh;
  margin-bottom: 1vh;
  margin-right: 1vw;
`;

const StyledSlider = styled(Carousel)`
  position: relative;
  width: 90%;
  height: 90%;
  margin-left: 10%;
`;

const Slide = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  flex-direction: column;
  height: 70vh;
  width: 40vw;
  z-index: 2;
`;

const StyledFork = styled(ForkOutlined)`
  font-size: 40px;
  color: white;
  transform: translateY(-180px);
  transition: opacity 0.2s ease-in-out;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const PlanetDescription = styled.div`
  font-family: "GalacticFont";
  font-size: 0.9vw;
  cursor: default;
  color: white;
  z-index: 3;
  height: 70%;
  width: 80%;
  margin-left: 10%;
  margin-top: 15%;
  text-align: center;
`;

const OwnedText = styled.div`
  font-family: "GalacticFont";
  font-size: 1.5vw;
  color: white;
  cursor: default;
  transform: translateY(-180px);
`;
