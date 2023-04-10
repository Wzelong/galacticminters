import { React } from "react";
import styled from "styled-components";

const ResourceDisplay = (props) => {
  const planetClicked = props.planetClicked;
  return (
    <>
      <ResrouceWrapper planetClicked={planetClicked}></ResrouceWrapper>
    </>
  );
};

export default ResourceDisplay;

const ResrouceWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  left: 5vw;
  top: 15%;
  height: ${props => props.planetClicked ? "70%" : "0px"};
  width: ${props => props.planetClicked ? "50%" : "0px"};
  opacity: ${props => props.planetClicked ? "1" : "0"};
  border: 2.5px solid white;
  border-radius: 15px;
  transition: width 1.2s ease-in-out, height 1.2s ease-in-out, opacity 1.2s ease-in-out;
`;