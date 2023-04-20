import { React, useState, useEffect } from "react";
import styled from "styled-components";
import silicon from "../../images/silicon.png";
import { ForkOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
const name = "Silicon";
const ResourceDisplay = (props) => {
  const [display, setDisplay] = useState("none");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (props.planetClicked) {
      setDisplay("block");
      setTimeout(() => setOpacity(1), 100);
    } else {
      setOpacity(0);
      setTimeout(() => setDisplay("none"), 1200);
    }
  }, [props.planetClicked]);
  return (
    <>
      <ResourceWrapper display={display} opacity={opacity}>
        <StyledSlider>
          <Slide>
            <MaterialName>SI</MaterialName>
            <MaterialImg src={silicon} />
            <StyledFork />
          </Slide>
          <Slide>
            <PlanetDescription>
              <h2>Planet {name}</h2>
              <ul style={{textAlign: "left", textTransform: "uppercase", lineHeight:"29px"}}>
                <li>Geography: Crystalline formations and sandy deserts; blue-grey color palette reflecting silicon natural hue.</li>
                <li>Meteorology: Electrical storms fueled by silicon-rich atmosphere; spectacular light displays.</li>
                <li>Biology: Life forms utilizing silicon as primary structural component; exotic flora and fauna.</li>
                <li>Civilization: Advanced society harnessing abundant silicon resources; innovative technologies in various domains.</li>
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
  opacity: ${props => props.opacity};
  display: ${props => props.display};
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
  transition: opacity 0.2s ease-in-out ;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const PlanetDescription = styled.div`
  font-family: "GalacticFont";
  font-size: 1vw;
  cursor: default;
  color: white;
  z-index: 3;
  height: 70%;
  width: 80%;
  margin-left: 10%;
  margin-top: 15%;
  text-align: center;
`; 