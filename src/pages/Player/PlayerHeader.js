import { React, useState } from "react";
import styled from "styled-components";
import logo from "../../images/PlayerHomeLogo.png";
import planetLogo from "../../images/planetIcon.png";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, RocketOutlined } from "@ant-design/icons";


const PlayerHeader = (props) => {
  const navigate = useNavigate();
  const setPlanetClicked = props.setPlanetClicked;
  const setShowPlanetName = props.setShowPlanetName;
  const enterSpaceship = props.enterSpaceship;
  const leaveSpaceship = props.leaveSpaceship;
  const [insideSpaceship, setInsideSpaceship] = useState(false);

  const handleSpaceshipClick = () => {
    if (insideSpaceship) {
      leaveSpaceship.current.emitEvent("mouseDown");
      setInsidePlanet(false);
      setShowPlanetName(true);
    } else {
      enterSpaceship.current.emitEvent("mouseDown");
      setPlanetClicked(false);
      setShowPlanetName(false);
    }
    setInsideSpaceship(!insideSpaceship);
  };

  const enterPlanet = props.enterPlanet;
  const leavePlanet = props.leavePlanet;
  const [insidePlanet, setInsidePlanet] = useState(false);

  const handlePlanetClick = () => {
    if (insidePlanet) {
      setTimeout(() => {leavePlanet.current.emitEvent("mouseDown"); setShowPlanetName(true);}, 500);
      setPlanetClicked(false);
      setInsideSpaceship(false);
    } else {
      enterPlanet.current.emitEvent("mouseDown");
      setShowPlanetName(false);
      setTimeout(() => setPlanetClicked(true), 500);
    }
    setInsidePlanet(!insidePlanet);
  };


  return(
    <>
      <HeaderWrapper>
        <Logo src={logo} onClick={() => {navigate("/"); window.location.reload();}} />
        <PlanetLogo src={planetLogo} onClick={handlePlanetClick} />
        <IconWrapper right={"12vw"} onClick={handleSpaceshipClick}>
          <RocketOutlined style={{fontSize: "40px", color: "white"}}/>
        </IconWrapper>
        <IconWrapper>
          <ShoppingCartOutlined style={{fontSize: "40px", color: "white"}}/>
        </IconWrapper>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  background-color: transparent;
  line-height: 1;
  width: 100%;
  height: 0px;
  z-index: 2;
`;

const Logo = styled.img`
  position: absolute;
  width: 80px;
  left: 5vw;
  top: 50px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const PlanetLogo = styled.img`
  position: absolute;
  width: 40px;
  right: 19.5vw;
  top: 56px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 50px;
  height: 50px;
  top: 50px;
  right: ${props => props.right ? props.right : "5vw"};

  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export default PlayerHeader;
