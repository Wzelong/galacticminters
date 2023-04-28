import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { React, useEffect, useRef, useState } from "react";
import {
  OrbitControls,
  OrthographicCamera,
  RoundedBox,
} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import col from "../../images/cubeTexture/col.jpg";
import disp from "../../images/cubeTexture/disp.jpg";
import metal from "../../images/cubeTexture/metal.jpg";
import nrm from "../../images/cubeTexture/nrm.jpg";
import rough from "../../images/cubeTexture/rough.jpg";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ReinhardToneMapping } from "three";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

let resetScene = false;

const PreviewCanvas = (props) => {
  const cameraProps = {
    position: [0.6, 0.4, 1],
    near: 0.1,
    far: 2000,
    zoom: 200,
  };

  const cameraRef = useRef();

  return (
    <Canvas
      style={{
        border: "2px solid black",
        borderRadius: "20px",
        width: "550px",
        height: "550px",
        marginLeft: "2vw",
      }}
      shadow={"soft"}
      gl={{ toneMapping: ReinhardToneMapping }}
    >
      <OrthographicCamera makeDefault {...cameraProps} ref={cameraRef} />
      <RotatingCube cubeColor={props.cubeColor} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2.5, 4]} intensity={5} castShadow={true} />
      <OrbitControls enableZoom={false} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.025}
          intensity={1.5}
          levels={9}
          luminanceSmoothing={0.01}
          mipmapBlur
        />
      </EffectComposer>
      <ScreenShot
        setTakeScreenshot={props.setTakeScreenshot}
        camera={cameraRef}
      />
    </Canvas>
  );
};

export default PreviewCanvas;

const RotatingCube = (props) => {
  const [colorMap, displacementMap, normalMap, roughnessMap, metalnessMap] =
    useLoader(TextureLoader, [col, disp, nrm, rough, metal]);
  const cubeRef = useRef();

  useFrame(() => {
    if (resetScene) {
      cubeRef.current.rotation.y = 0;
      setTimeout(() => {
        resetScene = false;
      }, 3000);
    } else {
      cubeRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={1} castShadow={true} />
      <group ref={cubeRef}>
        <mesh position={[0, 0, 0]} castShadow={true} receiveShadow>
          <RoundedBox
            args={[1, 1, 1]}
            radius={0.05}
            smoothness={3}
            creaseAngle={0.4}
          >
            <meshPhysicalMaterial
              map={colorMap}
              normalMap={normalMap}
              roughnessMap={roughnessMap}
              metalnessMap={metalnessMap}
              displacementMap={displacementMap}
              displacementScale={0.01}
              color={props.cubeColor}
              emissive={"rgb(30, 30, 30)"}
              roughness={0}
              metalness={0.9}
              clearcoat={0.4}
              clearcoatRoughness={0}
            />
          </RoundedBox>
        </mesh>
      </group>
    </>
  );
};

const ScreenShot = (props) => {
  const { gl, scene } = useThree();
  const takeScreenshot = async () => {
    resetScene = true;
    await sleep(1000);
    const camera = props.camera.current;
    gl.render(scene, camera);
    const dataURL = gl.domElement.toDataURL("image/png");
    try {
      const response = await fetch(dataURL);
      const imageBlob = await response.blob();
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `cubeScreenshots/${uniqueId}.png`);
      await uploadBytes(storageRef, imageBlob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error fetching screenshot:", error);
    }
  };
  useEffect(() => {
    props.setTakeScreenshot(() => takeScreenshot);
  }, []);
  return <></>;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
