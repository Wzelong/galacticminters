import { React, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import logo from "../../images/PlayerHomeLogo.png";
import planetLogo from "../../images/planetIcon.png";
import cubeIcon from "../../images/cubeIcon.png";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, RocketOutlined } from "@ant-design/icons";

const PlayerHeader = (props) => {
  const navigate = useNavigate();
  const [animationState, setAnimationState] = useState(-1);

  const {
    setPlanetClicked,
    setCubeClicked,
    setMarketClicked,
    setShowPlanetName,
    enterSpaceship,
    enterPlanet,
    enterCube,
    enterMarket,
    leave,
    setRender,
  } = props;

  function handleClick(stateNum) {
    if (animationState === stateNum) {
      setAnimationState(0);
    } else {
      setAnimationState(stateNum);
    }
  }

  useEffect(() => {
    switch (animationState) {
      case 0: // Return to initial state
        setTimeout(() => {
          leave.current.emitEvent("mouseDown");
          setShowPlanetName(true);
          setRender("");
        }, 600);
        setPlanetClicked(false);
        setCubeClicked(false);
        setMarketClicked(false);
        break;
      case 1: // enter cube
        setTimeout(() => {
          enterCube.current.emitEvent("mouseDown");
          setShowPlanetName(false);
          setTimeout(() => {
            setCubeClicked(true);
            setRender("cube");
          }, 600);
        }, 500);
        setPlanetClicked(false);
        setMarketClicked(false);
        break;
      case 2: // enter planet
        enterPlanet.current.emitEvent("mouseDown");
        setCubeClicked(false);
        setMarketClicked(false);
        setShowPlanetName(false);
        setTimeout(() => {
          setPlanetClicked(true);
          setRender("planet");
        }, 500);
        break;
      case 3: // enter spaceship
        enterSpaceship.current.emitEvent("mouseDown");
        setShowPlanetName(false);
        setPlanetClicked(false);
        setCubeClicked(false);
        setMarketClicked(false);
        break;
      case 4: // enter market
        setTimeout(() => {
          enterMarket.current.emitEvent("mouseDown");
          setShowPlanetName(false);
          setTimeout(() => {
            setMarketClicked(true);
            setRender("market");
          }, 600);
        }, 500);
        setPlanetClicked(false);
        setCubeClicked(false);
        break;
      default:
        break;
    }
  }, [animationState]);

  return (
    <>
      <HeaderWrapper>
        <Logo
          src={logo}
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
        />
        <Icon
          src={cubeIcon}
          right={"27.5vw"}
          top={"55px"}
          onClick={() => handleClick(1)}
        />
        <Icon src={planetLogo} onClick={() => handleClick(2)} />
        <IconWrapper right={"12vw"} onClick={() => handleClick(3)}>
          <RocketOutlined style={{ fontSize: "40px", color: "white" }} />
        </IconWrapper>
        <IconWrapper onClick={() => handleClick(4)}>
          <ShoppingCartOutlined style={{ fontSize: "40px", color: "white" }} />
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

const Icon = styled.img`
  position: absolute;
  width: 40px;
  right: ${(props) => (props.right ? props.right : "19.5vw")};
  top: ${(props) => (props.top ? props.top : "56px")};
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
  right: ${(props) => (props.right ? props.right : "5vw")};

  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export default PlayerHeader;
