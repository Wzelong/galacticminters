import { React, useState, useEffect } from "react";
import styled from "styled-components";
import silicon from "../../images/silicon.png";
import gold from "../../images/gold.png";
import silver from "../../images/silver.png";
import bi from "../../images/bi.png";
import cu from "../../images/cu.png";
import pt from "../../images/pt.png";
import { Carousel } from "antd";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Pagination } from "antd";

const materials = [
  { src: silicon, caption: "SI" },
  { src: gold, caption: "AU" },
  { src: silver, caption: "AG" },
  { src: bi, caption: "BI" },
  { src: cu, caption: "CU" },
  { src: pt, caption: "PT" },
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
  }, [props.cubeClicked]);

  // Create an array of spring animations, one for each image
  const springs = materials.map(() => useSpring(() => ({ x: 0, y: 0 })));
  const bind = (index) => useDrag(({ down, movement: [mx, my], offset: [ox, oy] }) => {
    springs[index][1].start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  });

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
                      {...bind(index)()}
                      as={animated.div}
                      style={{ x: springs[index][0].x, y: springs[index][0].y }}
                    >
                      <MaterialImg src={image.src} />
                      <Caption>{image.caption}</Caption>
                    </ImageContainer>
                  );
                } else {
                  return (
                    <ImageContainer
                      key={index}
                      {...bind(index)()}
                      as={animated.div}
                      style={{ x: springs[index][0].x, y: springs[index][0].y, display: "none" }}
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
            <DropZone></DropZone>
          </Slide>
          <Slide>
          </Slide>
        </StyledSlider>
      </CubeWrapper>
    </>
  );
};

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
  border: 2px solid rgb(255, 255, 255, 0);
  transition: border 0.2s ease-in-out;
  border-radius: 5px;
  touch-action: none;
  background-color: black;
  :hover {
    border: 2px solid rgb(255, 255, 255, 1);
    cursor: pointer;
  }
`;

const Caption = styled.span`
  font-family: "GalacticFont";
  font-size: 1.2vw;
  color: white;
  text-align: center;
  margin-top: -2rem;
`;

const DropZone = styled.div`
  position: absolute;
  left: 70%;
  top: 30%;
  height: 200px;
  width: 200px;
  border: 2px dashed white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
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
