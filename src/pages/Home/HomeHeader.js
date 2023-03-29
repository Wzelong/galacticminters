import { React } from "react";
import styled from "styled-components";
import logo from "../../images/GalacticMintersLogo.png";
import Metamask from "./Metamask";

const HomeHeader = () => {

  const handleConnect = async () => {
    const { provider, signer } = await Metamask();
    // Use the provider and signer objects here
  };

  return(
    <>
      <HeaderWrapper>
        <Logo src={logo}></Logo>
        <HeaderButton onClick={handleConnect}>Connect</HeaderButton>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  line-height: 1;
  width: 100%;
  height: 110px;
  z-index: 1;
`;

const Logo = styled.img`
  position: absolute;
  width: 400px;
  left: 4vw;
  top: 70px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const HeaderButton = styled.div`
  color: white;
  width: fit-content;
  height: 23px;
  position: absolute;
  right: 100px;
  top: 75px;
  font-family: "GalacticFont";
  font-size: 25px;
  font-weight: 700;
  padding: 7px 7px;
  text-align: center;
  border-radius: 5px;
  transition: 100ms ease-in;
  :hover {
    background-color: white;
    color: black;
  }
  cursor: pointer;
`;

export default HomeHeader;