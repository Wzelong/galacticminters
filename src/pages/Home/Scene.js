import { React } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
} from "@react-three/drei";
import Spline from "@splinetool/react-spline";

function Scene() {

  return (
    <>
      <Canvas
        camera={{ position: [0, 15, 90] }}
        style={{ backgroundColor: "rgb(0, 0, 0)", position: "absolute", top: 0, left: 0, zIndex: -1  }}
      >
        <Stars
          radius={200}
          depth={100}
          count={1000}
          factor={15}
          saturation={1}
          fade
          speed={2}
        />
        <ambientLight intensity={0.1} />
        <OrbitControls makeDefault maxDistance={100} />
      </Canvas>
      <Spline scene="https://prod.spline.design/qOEgWG80rQnifgb4/scene.splinecode" style={{position: "absolute", widhth: "100%", height: "100vh", top: 0, left: 0, zIndex: 0, backgroundColor:"rgb(0,0,0,0)"}} />
    </>
  );
}

export default Scene;
