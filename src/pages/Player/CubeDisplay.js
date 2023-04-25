import { React, useState, useEffect, useRef, Suspense } from "react";
import styled from "styled-components";
import silicon from "../../images/silicon.png";
import gold from "../../images/gold.png";
import silver from "../../images/silver.png";
import bi from "../../images/bi.png";
import cu from "../../images/cu.png";
import pt from "../../images/pt.png";
import u from "../../images/u.png";
import ti from "../../images/ti.png";
import k from "../../images/k.png";
import { Carousel } from "antd";
import { Pagination } from "antd";
import PreviewCanvas from "./PreviewCanvas";
import mixbox from "mixbox";

const materials = [
  { src: silicon, caption: "SI", color: "rgb(40, 40, 43)" },
  { src: gold, caption: "AU", color: "rgb(255, 215, 0)" },
  { src: silver, caption: "AG", color: "rgb(222, 222, 222)" },
  { src: bi, caption: "BI", color: "rgb(224, 191, 184)" },
  { src: cu, caption: "CU", color: "rgb(184, 115, 51)" },
  { src: pt, caption: "PT", color: "rgb(135, 206, 235)" },
  { src: u, caption: "U", color: "rgb(46, 139, 87)" },
  { src: ti, caption: "TI", color: "rgb(159, 226, 191)" },
  { src: k, caption: "K", color: "rgb(128, 0, 128)" },
];

const CubeDisplay = (props) => {
  const [display, setDisplay] = useState("none");
  const [opacity, setOpacity] = useState(0);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(9);
  const handlePageChange = (page) => {
    setMinIndex((page - 1) * 9);
    setMaxIndex(page * 9);
  };
  useEffect(() => {
    if (props.cubeClicked) {
      setDisplay("block");
      setTimeout(() => setOpacity(1), 100);
    } else {
      setOpacity(0);
      setTimeout(() => setDisplay("none"), 1200);
    }
    colorMixer();
  }, [props.cubeClicked]);

  const colors = [];

  const [cubeColor, setCubeColor] = useState("rgb(113, 121, 126)");

  // Create state to record clicked for each material
  const [materialClicked, setMaterialClicked] = useState(materials.map(() => false));
  const handleMaterialClick = (index) => {
    const newClickedState = materialClicked.map((clicked, i) => {
      if (i === index) {
        return !clicked;
      } else {
        return materialClicked[i];
      }
    });
    setMaterialClicked(newClickedState);
    for (let i = 0; i < newClickedState.length; i++) {
      if (newClickedState[i]) {
        colors.push(materials[i].color);
      }
    }
    const newColor = colorMixer(colors);
    console.log(newColor);
    setCubeColor(newColor);
  };

  return (
    <>
      <CubeWrapper display={display} opacity={opacity}>
        <StyledSlider>
          <Slide>
            <ImageList>
              {materials.map((image, index) => {
                if (index >= minIndex && index < maxIndex) {
                  return (
                    <ImageContainer
                      key={index}
                      onClick={() => handleMaterialClick(index)}
                      clicked={materialClicked[index]}
                    >
                      <MaterialImg src={image.src} />
                      <Caption>{image.caption}</Caption>
                    </ImageContainer>
                  );
                }
              }
              )}
              <Page
                simple
                defaultCurrent={1}
                pageSize={9}
                onChange={handlePageChange}
                total={materials.length}
              />
            </ImageList>
            <PreviewScene>
              <Suspense>
                <PreviewCanvas cubeColor={cubeColor} />
              </Suspense>
            </PreviewScene>
          </Slide>
          <Slide>
          </Slide>
        </StyledSlider>
      </CubeWrapper>
    </>
  );
};

function colorMixer(colors = []) {
  if (colors.length === 0) {
    return "rgb(113, 121, 126)";
  } else if (colors.length === 1) {
    return colors[0];
  } else if (colors.length === 2) {
    let newColor = mixbox.lerp(colors[0], colors[1], 0.5);
    newColor = "rgb(" + newColor[0] + ", " + newColor[1] + ", " + newColor[2] + ")";
    return newColor;
  } else {
    const zArray = [];
    for (let i = 0; i < colors.length; i++) {
      zArray.push(mixbox.rgbToLatent(colors[i]));
    }
    let mixFactor = 1.0 / zArray.length;
    let zMix = new Array(mixbox.LATENT_SIZE);
    
    for (let i = 0; i < zMix.length; i++) {
      let zValue = 0;
      for (let j = 0; j < zArray.length; j++) {
        zValue += zArray[j][i] * mixFactor;
      }
      zMix[i] = zValue;
    }

    let rgbMix = mixbox.latentToRgb(zMix);
    let newColor = "rgb(" + rgbMix[0] + ", " + rgbMix[1] + ", " + rgbMix[2] + ")";
    return newColor;
  }
}

export default CubeDisplay;

const CubeWrapper = styled.div`
  position: absolute;
  background-color: transparent;
  left: 5vw;
  top: 15%;
  height: 80%;
  width: 90%;
  opacity: ${props => props.opacity};
  display: ${props => props.display};
  border-radius: 15px;
  transition: opacity 0.5s ease-in-out;
  color: white;
`;


const StyledSlider = styled(Carousel)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Slide = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  flex-direction: row;
  height: 80vh;
  width: 45vw;
`;

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 45%;
  height: 80%;
  margin-left: 2.5%;
  /* Hide scrollbar for Chrome, Safari, and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge, and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MaterialImg = styled.img`
  width: 85%;
  object-fit: cover;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${props => props.clicked ? "2px solid rgb(255, 255, 255, 1)" : "none"};
  transition: border 0.25s ease-in-out;
  touch-action: none;
  background-color: black;
  :hover {
    cursor: pointer;
  }
`;

const Caption = styled.span`
  font-family: "GalacticFont";
  font-size: 1.2vw;
  color: white;
  text-align: center;
  margin-top: -2rem;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.25s ease-in-out;
  ${ImageContainer}:hover & {
    border-bottom: 1px solid white;
  }
`;

const PreviewScene = styled.div`
  position: absolute;
  left: 60%;
  top: 5%;
  height: 60vh;
  width: 35vw;
`;

const Page = styled(Pagination)`
  color: white;
  margin: 0 auto;
  position: absolute;
  margin-left: 16vw;
  height: 10px;
  top: 88%;
  .ant-pagination-simple-pager input {
    background-color: transparent !important;
  }
  .ant-pagination-prev .ant-pagination-item-link {
    color: white;
  }
  .ant-pagination-next .ant-pagination-item-link {
    color: white;
  }
`;
