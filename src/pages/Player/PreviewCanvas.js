import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { React, useState, useEffect, useRef } from "react";
import { OrbitControls, OrthographicCamera, RoundedBox, MeshRefractionMaterial, Tetrahedron } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import col from "../../images/cubeTexture/col.jpg";
import disp from "../../images/cubeTexture/disp.jpg";
import metal from "../../images/cubeTexture/metal.jpg";
import nrm from "../../images/cubeTexture/nrm.jpg";
import rough from "../../images/cubeTexture/rough.jpg";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const PreviewCanvas = (props) => {
  const cameraProps = {
    position: [0.6, 0.4, 1],
    near: 0.1,
    far: 2000,
    zoom: 170,
  };
  return (
    <Canvas style={{border: "2px solid black", borderRadius: "10px"}}>
      <OrthographicCamera makeDefault {...cameraProps} />
      <RotatingCube cubeColor={props.cubeColor}/>
      <ambientLight intensity={0.2} />
      <pointLight position={[0.8, 3, 4]} intensity={2} castShadow={true}/>
      <spotLight position={[0, 2, 3]} intensity={2} castShadow={true}/>
      <OrbitControls enableZoom={false} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.025} intensity={1.5} levels={9} luminanceSmoothing={0.01} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
};

export default PreviewCanvas;

const RotatingCube = (props) => {
  // Load the textures
  const [colorMap, displacementMap, normalMap, roughnessMap, metalnessMap] = useLoader(TextureLoader, [
    col,
    disp,
    nrm,
    rough,
    metal,
  ]);
  const cubeRef = useRef();

  useFrame(() => {
    if (cubeRef) {
      cubeRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={1} castShadow={true}/>
      <mesh ref={cubeRef} position={[0, 0, 0]} castShadow={true} receiveShadow>
        <RoundedBox
          args={[1, 1, 1]} 
          radius={0.05} 
          smoothness={3} 
          creaseAngle={0.4} 
        >
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            metalnessMap={metalnessMap}
            displacementMap={displacementMap}
            displacementScale={0.01}
            color={props.cubeColor}
            emissive={"rgb(30, 30, 30)"}
            roughness={0.3}
            metalness={0.9}
          />
        </RoundedBox>
      </mesh>
    </>
  );
};
