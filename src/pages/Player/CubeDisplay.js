import { React, useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import { Carousel, Pagination } from "antd";
import PreviewCanvas from "./PreviewCanvas";
import mixbox from "mixbox";
import { ToolOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAccountAddress } from "../../contexts/AccountAddrContext";
import { db } from "../../firebase";
import {
  doc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
const formatCooldownTime = (time) => {
  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const CubeDisplay = (props) => {
  const cubePageMax = 6;
  const { accountAddress } = useAccountAddress();
  const [opacity, setOpacity] = useState(0);
  const [playerCubes, setPlayerCubes] = useState([]);
  const [cubeColor, setCubeColor] = useState("rgb(113, 121, 126)");
  const [materials, setMaterials] = useState([]);
  const [materialClicked, setMaterialClicked] = useState(null);
  const [validCraft, setValidCraft] = useState(false);
  const [disableCraft, setDisableCraft] = useState(false);
  const [takeScreenshot, setTakeScreenshot] = useState(null);
  const [pageIndex, setPageIndex] = useState([0, cubePageMax]);
  const [selling, setSelling] = useState(false);
  const [priceValid, setPriceValid] = useState(false);
  const [price, setPrice] = useState("");
  const [cubeMaterial, setCubeMaterial] = useState(null);
  const [cubeClickedIndex, setCubeClickedIndex] = useState(-1);
  const [cooldownTime, setCooldownTime] = useState(null);
  const listenForCooldownUpdates = () => {
    const cooldownDocRef = doc(db, "craftCoolDowns", accountAddress);
    const unsubscribe = onSnapshot(cooldownDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const elapsedTime = Date.now() - data.timestamp;
        const cooldownDuration = 60 * 1000;
        if (elapsedTime < cooldownDuration) {
          setCooldownTime(cooldownDuration - elapsedTime);
        } else {
          setCooldownTime(0);
        }
      }
    });

    return unsubscribe;
  };
  useEffect(() => {
    if (cooldownTime === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCooldownTime((prevCooldownTime) => {
        if (prevCooldownTime > 0) {
          return prevCooldownTime - 1000;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [cooldownTime]);
  useEffect(() => {
    if (props.cubeClicked) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
    getPlayerCubes();
    getResource();
    const unsubscribe = listenForCooldownUpdates();
    return () => {
      unsubscribe();
    };
  }, [props.cubeClicked]);

  const handlePageChange = (page) => {
    setPageIndex([(page - 1) * cubePageMax, page * cubePageMax]);
  };

  const getPlayerCubes = async () => {
    const q = query(
      collection(db, "cubes"),
      where("owner", "==", accountAddress)
    );
    await getDocs(q).then((querySnapshot) => {
      setPlayerCubes(querySnapshot.docs.map((doc) => doc.data()));
    });
  };

  const getResource = async () => {
    const q = query(collection(db, "players", accountAddress, "resources"));
    await getDocs(q).then((querySnapshot) => {
      setMaterials(querySnapshot.docs.map((doc) => doc.data()));
      setMaterialClicked(querySnapshot.docs.map((doc) => false));
    });
  };

  const handleMaterialClick = (index) => {
    setCubeClickedIndex(-1);
    setSelling(false);
    const newClickedState = materialClicked.map((clicked, i) => {
      if (i === index) {
        return !clicked;
      } else {
        return materialClicked[i];
      }
    });
    setMaterialClicked(newClickedState);
    const materialList = [];
    const colors = [];
    for (let i = 0; i < newClickedState.length; i++) {
      if (newClickedState[i]) {
        colors.push(materials[i].color);
        materialList.push(materials[i].symbol);
      }
    }
    if (colors.length > 0) {
      setValidCraft(true);
    } else {
      setValidCraft(false);
    }
    const newColor = colorMixer(colors);
    setCubeColor(newColor);
    setCubeMaterial(materialList);
  };
  const handleCubeClick = (index) => {
    setMaterialClicked(materialClicked.map(() => false));
    setSelling(false);
    if (index === cubeClickedIndex) {
      setCubeClickedIndex(-1);
      setCubeColor("rgb(113, 121, 126)");
    } else {
      setCubeClickedIndex(index);
      setCubeColor(playerCubes[index].color);
    }
  };
  const craft = async () => {
    if (validCraft) {
      const timestamp = Date.now();
      const cooldownDocRef = doc(db, "craftCoolDowns", accountAddress);
      await setDoc(cooldownDocRef, { timestamp });
      const color = cubeColor;
      const screenshotURL = await takeScreenshot();
      const cubeId = await getCurrentCubeId();
      const cubeData = {
        id: cubeId,
        owner: accountAddress,
        color: color,
        material: cubeMaterial.join(" + "),
        screenshot: screenshotURL,
        onSell: false,
        price: "0 ETH",
      };
      const cubeDocRef = doc(db, "cubes", cubeId.toString());
      await setDoc(cubeDocRef, cubeData);
      await incrementCubeId();
      getPlayerCubes();
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    if (isNaN(value) || value === "") {
      setPriceValid(false);
      setPrice("");
    } else {
      setPriceValid(true);
    }
  };
  const handleSell = async () => {
    if (priceValid) {
      const cubeId = playerCubes[cubeClickedIndex].id;
      const cubeDocRef = doc(db, "cubes", cubeId.toString());
      await updateDoc(cubeDocRef, {
        onSell: true,
        price: price + " ETH",
      });
      await getPlayerCubes();
      setSelling(false);
      setPrice("");
    }
  };
  const handleCancel = async () => {
    const cubeId = playerCubes[cubeClickedIndex].id;
    const cubeDocRef = doc(db, "cubes", cubeId.toString());
    await updateDoc(cubeDocRef, {
      onSell: false,
      price: "0 ETH",
    });
    await getPlayerCubes();
    setSelling(false);
    setPrice("");
  };

  return (
    <>
      <CubeWrapper opacity={opacity}>
        <StyledSlider
          width={"50%"}
          afterChange={(number) => {
            if (number === 0) {
              setDisableCraft(false);
            } else {
              setDisableCraft(true);
            }
          }}
        >
          <Slide height={"80vh"}>
            <ImageList>
              {materials.map((obj, index) => {
                return (
                  <ImageContainer
                    key={index}
                    onClick={() => handleMaterialClick(index)}
                    clicked={materialClicked[index]}
                  >
                    <MaterialImg src={obj.image} />
                    <Caption marginTop={"-2rem"} fontFamily={"GalacticFont"}>
                      {obj.symbol}
                    </Caption>
                  </ImageContainer>
                );
              })}
            </ImageList>
          </Slide>
          <Slide>
            <CubeList>
              {playerCubes.map((cube, index) => {
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
                        fontFamily={
                          "Arial Black, Arial Bold, Gadget, sans-serif"
                        }
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
                total={playerCubes.length === 0 ? 1 : playerCubes.length}
              />
            </CubeList>
          </Slide>
        </StyledSlider>
        <PreviewScene>
          <StyledSlider width={"100%"}>
            <Slide height={"70vh"}>
              {cooldownTime !== null ? (
                cooldownTime > 0 ? (
                  <IconWrapper valid={validCraft} disableCraft={disableCraft}>
                    {formatCooldownTime(cooldownTime)}
                  </IconWrapper>
                ) : (
                  <IconWrapper
                    valid={validCraft}
                    disableCraft={disableCraft}
                    onClick={craft}
                  >
                    <ToolOutlined style={{ fontSize: "50px" }} />
                  </IconWrapper>
                )
              ) : null}
              <Suspense>
                <PreviewCanvas
                  cubeColor={cubeColor}
                  setTakeScreenshot={setTakeScreenshot}
                />
              </Suspense>
            </Slide>
            <Slide height={"70vh"}>
              <CubeInfoWrapper>
                {cubeClickedIndex >= 0 && (
                  <>
                    <h1>Cube Info</h1>
                    <CubeInfo>
                      <p>&bull; uid: {playerCubes[cubeClickedIndex].id}</p>
                      <p>&bull; Color: {playerCubes[cubeClickedIndex].color}</p>
                      <p>
                        &bull; Material:{" "}
                        {playerCubes[cubeClickedIndex].material}
                      </p>
                      <p>
                        &bull; OnSell:{" "}
                        {playerCubes[cubeClickedIndex].onSell.toString()}
                      </p>
                      <p>&bull; Price: {playerCubes[cubeClickedIndex].price}</p>
                    </CubeInfo>
                    {playerCubes[cubeClickedIndex].onSell ? (
                      <SellCubeButton width={"40%"} onClick={handleCancel}>
                        Cancel Cell
                      </SellCubeButton>
                    ) : selling ? (
                      <PriceInputWrapper>
                        <h3>Eth</h3>
                        <PriceInput
                          placeholder="price"
                          value={price}
                          onChange={handleInputChange}
                        ></PriceInput>
                        <StyledCheck valid={priceValid} onClick={handleSell} />
                      </PriceInputWrapper>
                    ) : (
                      <SellCubeButton
                        width={"28%"}
                        onClick={() => setSelling(true)}
                      >
                        SELL
                      </SellCubeButton>
                    )}
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

function colorMixer(colors = []) {
  if (colors.length === 0) {
    return "rgb(113, 121, 126)";
  } else if (colors.length === 1) {
    return colors[0];
  } else if (colors.length === 2) {
    let newColor = mixbox.lerp(colors[0], colors[1], 0.5);
    newColor =
      "rgb(" + newColor[0] + ", " + newColor[1] + ", " + newColor[2] + ")";
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
    let newColor =
      "rgb(" + rgbMix[0] + ", " + rgbMix[1] + ", " + rgbMix[2] + ")";
    return newColor;
  }
}

const getCurrentCubeId = async () => {
  const cubeCounterDocRef = doc(db, "metadata", "cubeCounter");
  const cubeCounterSnapshot = await getDoc(cubeCounterDocRef);

  if (!cubeCounterSnapshot.exists()) {
    await setDoc(cubeCounterDocRef, { currentId: 0 });
    return 0;
  } else {
    return cubeCounterSnapshot.data().currentId;
  }
};

const incrementCubeId = async () => {
  const cubeCounterDocRef = doc(db, "metadata", "cubeCounter");
  await updateDoc(cubeCounterDocRef, { currentId: increment(1) });
};

export default CubeDisplay;

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

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 90%;
  height: 90%;
  margin-left: 5%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MaterialImg = styled.img`
  width: 85%;
  object-fit: cover;
`;

const CubeList = styled.div`
  display: inline-block;
  width: 100%;
  height: 80vh;
`;

const CubeImg = styled.img`
  width: 102%;
`;

const CubeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  float: left;
  width: 32%;
  margin-top: 3vh;
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

const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 50px;
  height: 50px;
  top: 54vh;
  left: 16vw;
  z-index: 2;
  color: ${(props) => (props.valid ? "white" : "grey")};
  transition: color 0.15s ease-in-out;
  display: ${(props) => (props.disableCraft ? "none" : "block")};
  font-family: Arial Black, Arial Bold, Gadget, sans-serif;
  font-size: 30px;

  :hover {
    cursor: ${(props) => (props.valid ? "pointer" : "not-allowed")};
    color: grey;
  }
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

const SellCubeButton = styled.div`
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

const PriceInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 6.5vh;
  flex-direction: row;
`;

const PriceInput = styled.input`
  width: 40%;
  height: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  color: white;
  font-size: 1.2vw;
  padding-left: 15px;
  padding-right: 15px;
  font-family: "GalacticFont";
  appearance: none;
`;

const StyledCheck = styled(CheckCircleOutlined)`
  cursor: pointer;
  font-size: 28px;
  z-index: ${(props) => (props.valid ? "1" : "-1")};
  opacity: ${(props) => (props.valid ? "1" : "0.3")};
`;
