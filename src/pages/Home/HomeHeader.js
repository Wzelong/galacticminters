import { React } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import logo from "../../images/GalacticMintersLogo.png";


const HomeHeader = () => {

  const handleConnect = async () => {
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    }
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
  background-color: transparent;
  line-height: 1;
  width: 100%;
  height: 0px;
  z-index: 1;
`;

const Logo = styled.img`
  position: absolute;
  width: 400px;
  left: 5vw;
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