import { React, useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import { Carousel, Pagination } from "antd";
import PreviewCanvas from "./PreviewCanvas";
import { LoadingOutlined } from "@ant-design/icons";
import { useEtherContext } from "../../contexts/EtherContext";
import { db } from "../../firebase";
import {
  doc,
  updateDoc,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { ethers } from "ethers";

const MarketDisplay = (props) => {
  const cubePageMax = 8;
  const { accountAddress, signer, provider, contract } = useEtherContext();
  const [opacity, setOpacity] = useState(0);
  const [marketCubes, setMarketCubes] = useState([]);
  const [cubeColor, setCubeColor] = useState("rgb(113, 121, 126)");
  const [pageIndex, setPageIndex] = useState([0, cubePageMax]);
  const [cubeClickedIndex, setCubeClickedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.marketClicked) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
    const unsubscribe = getMarketCubes();

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, [props.marketClicked]);

  const handlePageChange = (page) => {
    setPageIndex([(page - 1) * cubePageMax, page * cubePageMax]);
  };
  const getMarketCubes = () => {
    const q = query(collection(db, "cubes"), where("onSell", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cubes = querySnapshot.docs.map((doc) => doc.data());
      cubes.sort((a, b) => a.cubeId - b.cubeId);
      setMarketCubes(cubes);
    });
    return unsubscribe;
  };

  const handleCubeClick = (index) => {
    if (index === cubeClickedIndex) {
      setCubeClickedIndex(-1);
      setCubeColor("rgb(113, 121, 126)");
    } else {
      setCubeClickedIndex(index);
      setCubeColor(marketCubes[index].color);
    }
  };

  const screenshotPlaceHolder = () => {};

  const transferCube = async (id) => {
    try {
      const result = await contract.transferCube(id);
      await result.wait();
    } catch (err) {
      console.error("Error calling the smart contract function:", err);
    }
  };
  const handleBuyCube = async () => {
    setLoading(true);
    const id = marketCubes[cubeClickedIndex].id.toString();
    const price = marketCubes[cubeClickedIndex].price.split(" ")[0];
    const sellerAddress = marketCubes[cubeClickedIndex].owner;
    try {
      const tx = await signer.sendTransaction({
        to: sellerAddress,
        value: ethers.parseEther(price),
      });
      await tx.wait();
      console.log("Transaction successful!");
      setCubeClickedIndex(-1);
      const cubeRef = doc(db, "cubes", id);
      await updateDoc(cubeRef, {
        owner: accountAddress,
        onSell: false,
        price: 0,
      });
    } catch (err) {
      console.log("Transaction failed!");
    }
    setLoading(false);
  };

  return (
    <>
      <CubeWrapper opacity={opacity}>
        <CubeList>
          {marketCubes.map((cube, index) => {
            if (index >= pageIndex[0] && index < pageIndex[1]) {
              return (
                <CubeContainer
                  key={index}
                  onClick={() => handleCubeClick(index)}
                  clicked={cubeClickedIndex === index}
                >
                  <CubeImg src={cube.screenshot} />
                  <Caption
                    marginTop={"-2rem"}
                    fontFamily={"Arial Black, Arial Bold, Gadget, sans-serif"}
                  >
                    {cube.id}
                  </Caption>
                </CubeContainer>
              );
            }
          })}
          <Page
            simple
            defaultCurrent={1}
            pageSize={cubePageMax}
            onChange={handlePageChange}
            total={marketCubes.length === 0 ? 1 : marketCubes.length}
          />
        </CubeList>
        <PreviewScene>
          <StyledSlider width={"100%"}>
            <Slide height={"70vh"}>
              <Suspense>
                <PreviewCanvas
                  cubeColor={cubeColor}
                  setTakeScreenshot={screenshotPlaceHolder}
                />
              </Suspense>
            </Slide>
            <Slide height={"70vh"}>
              <CubeInfoWrapper>
                {cubeClickedIndex >= 0 && (
                  <>
                    <h1>Cube Info</h1>
                    <CubeInfo>
                      <p>&bull; uid: {marketCubes[cubeClickedIndex].id}</p>
                      <p>&bull; Color: {marketCubes[cubeClickedIndex].color}</p>
                      <p>
                        &bull; Material:{" "}
                        {marketCubes[cubeClickedIndex].material}
                      </p>
                      <p>
                        &bull; OnSell:{" "}
                        {marketCubes[cubeClickedIndex].onSell.toString()}
                      </p>
                      <p>&bull; Price: {marketCubes[cubeClickedIndex].price}</p>
                    </CubeInfo>
                    {marketCubes[cubeClickedIndex].owner !== accountAddress ? (
                      !loading ? (
                        <BuyCubeButton width={"25%"} onClick={handleBuyCube}>
                          Buy
                        </BuyCubeButton>
                      ) : (
                        <LoadingOutlined style={{ fontSize: "40px" }} />
                      )
                    ) : null}
                  </>
                )}
              </CubeInfoWrapper>
            </Slide>
          </StyledSlider>
        </PreviewScene>
      </CubeWrapper>
    </>
  );
};

export default MarketDisplay;

const CubeWrapper = styled.div`
  position: absolute;
  background-color: transparent;
  left: 5vw;
  top: 15%;
  height: 80%;
  width: 90%;
  opacity: ${(props) => props.opacity};
  display: block;
  border-radius: 15px;
  transition: opacity 0.5s ease-in-out;
  color: white;
`;

const StyledSlider = styled(Carousel)`
  position: relative;
  width: ${(props) => props.width};
  height: 100%;
`;

const Slide = styled.div`
  position: relative;
  display: inline-block;
  height: ${(props) => props.height};
  width: 45vw;
  overflow-y: scroll;
`;

const CubeList = styled.div`
  position: absolute;
  display: inline-block;
  width: 55%;
  height: 80vh;
  left: 0;
`;

const CubeImg = styled.img`
  width: 100%;
`;

const CubeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  float: left;
  width: 24%;
  margin-top: 6vh;
  border: ${(props) =>
    props.clicked
      ? "2px solid rgb(255, 255, 255, 1)"
      : "2px solid transparent"};
  transition: border 0.25s ease-in-out;
  :hover {
    cursor: pointer;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${(props) =>
    props.clicked ? "2px solid rgb(255, 255, 255, 1)" : "none"};
  transition: border 0.25s ease-in-out;
  background-color: black;
  :hover {
    cursor: pointer;
  }
`;

const Caption = styled.span`
  font-family: ${(props) => props.fontFamily};
  font-size: 1.2vw;
  color: white;
  text-align: center;
  margin-top: ${(props) => props.marginTop};
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.25s ease-in-out;
  ${ImageContainer}:hover & {
    border-bottom: 1px solid white;
  }
`;

const PreviewScene = styled.div`
  position: absolute;
  left: 60%;
  top: 4%;
  height: 60vh;
  width: 35vw;
`;

const Page = styled(Pagination)`
  color: white;
  margin: 0 auto;
  position: absolute;
  width: 50%;
  margin-left: 25%;
  height: 10px;
  top: 90%;
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

const CubeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: transparent;
  width: 90%;
  height: 90%;
  margin-left: 5%;
  font-family: "GalacticFont";
  color: white;
  font-size: 1.2vw;
  border: 2px solid white;
  border-radius: 15px;
`;

const CubeInfo = styled.div`
  display: inline-block;
  text-align: left;
  width: 70%;
  height: 55%;
  margin-top: -2vh;
  margin-bottom: 2vh;
`;

const BuyCubeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width};
  height: 6.5vh;
  border: 1.5px solid white;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out;
  :hover {
    background-color: white;
    color: black;
  }
`;
