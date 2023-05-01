import React from "react";
import styled from "styled-components";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const AddData = () => {
  const addData = async () => {
    const id = 8;
    const data = {
      id: id,
      name: "Patassium",
      scene: "https://prod.spline.design/bNtDukdal79Xxgmf/scene.splinecode",
      material: {
        symbol: "K",
        color: "rgb(189,0,255)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/galacticminters.appspot.com/o/planetResource%2Fk.png?alt=media&token=297c8ab5-50d0-45b8-bc8c-fc8e9e245bb4",
      },
      info: {
        geography:
          "Fertile, nutrient-rich plains and dense forests; a landscape thriving due to potassium's vital role in plant growth.",
        meteorology:
          "Mild, humid climate with frequent, nurturing rains; a climate sustained by potassium's water-soluble nature.",
        biology:
          "Life forms utilizing potassium for essential biological functions; lush, vibrant flora and fauna.",
        civilization:
          "Sustainable society built on abundant potassium resources; innovations in agriculture, healthcare, and clean energy.",
      },
    };
    const ref = doc(db, "planets", id.toString());
    await setDoc(ref, data);
  };
  return (
    <Body>
      <AddButton onClick={() => addData()}>Add</AddButton>
    </Body>
  );
};

export default AddData;

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddButton = styled.div`
  width: 20vw;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border: 2px solid white;
  font-family: "GalacticFont";
  font-size: 50px;
  cursor: pointer;
  transition: 100ms ease-in;
  :hover {
    background-color: white;
    color: black;
  }
`;
