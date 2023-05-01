import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styled from "styled-components";
import logo from "../../images/PlayerHomeLogo.png";
import { useAccountAddress } from "../../contexts/AccountAddrContext";
import { db } from "../../firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
const formatCooldownTime = (time) => {
  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const Galaxy = (props) => {
  const setDisplayGalaxy = props.setDisplayGalaxy;
  const setPlanetID = props.setPlanetID;
  const setSceneLoaded = props.setSceneLoaded;
  const { accountAddress } = useAccountAddress();
  const [cooldownTime, setCooldownTime] = useState(null);
  const handleJump = async () => {
    setDisplayGalaxy(false);
    const number = Math.floor(Math.random() * 9).toString();
    setPlanetID(number);
    setSceneLoaded(false);
    const timestamp = Date.now();
    const cooldownDocRef = doc(db, "jumpCoolDowns", accountAddress);
    await setDoc(cooldownDocRef, { timestamp });
  };
  const listenForCooldownUpdates = () => {
    const cooldownDocRef = doc(db, "jumpCoolDowns", accountAddress);
    const unsubscribe = onSnapshot(cooldownDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const elapsedTime = Date.now() - data.timestamp;
        const cooldownDuration = 60 * 1000; // 5 minutes
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
    const unsubscribe = listenForCooldownUpdates();
    return () => {
      unsubscribe();
    };
  }, []);
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
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <HeaderWrapper>
        <Logo src={logo}></Logo>
        {cooldownTime !== null ? (
          cooldownTime > 0 ? (
            <CoolDown>{formatCooldownTime(cooldownTime)}</CoolDown>
          ) : (
            <HeaderButton right={"5vw"} onClick={() => handleJump()}>
              Jump
            </HeaderButton>
          )
        ) : null}
      </HeaderWrapper>
      <Canvas
        camera={{ position: [0, 0, 130], fov: 60 }}
        style={{ backgroundColor: "black" }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <SpiralGalaxy stars={props.stars} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default Galaxy;

const HAZE_MIN = 2;
const HAZE_MAX = 3;
const HAZE_OPACITY = 0.8;
function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}
const Haze = ({ position, color, camera }) => {
  const spriteRef = useRef();

  useEffect(() => {
    const updateScale = () => {
      const dist = spriteRef.current.position.distanceTo(camera.position) / 250;
      spriteRef.current.material.opacity = clamp(
        HAZE_OPACITY * Math.pow(dist / 2.5, 2),
        0,
        HAZE_OPACITY
      );
      spriteRef.current.material.needsUpdate = true;
    };

    updateScale();
    camera.addEventListener("change", updateScale);

    return () => {
      camera.removeEventListener("change", updateScale);
    };
  }, [camera]);

  const scale = clamp(HAZE_MAX * Math.random(), HAZE_MIN, HAZE_MAX);

  return (
    <sprite ref={spriteRef} position={position} scale={[scale, scale, scale]}>
      <spriteMaterial
        attach="material"
        color={color}
        transparent
        opacity={HAZE_OPACITY}
      />
    </sprite>
  );
};

const SpiralGalaxy = (props) => {
  const coreRef = useRef();
  const spiralRef = useRef();
  const { camera } = useThree();
  const { coreStars, spiralStars } = props.stars;
  useEffect(() => {
    coreRef.current.rotation.x = -Math.PI / 4;
    spiralRef.current.rotation.x = -Math.PI / 4;
  }, []);

  useFrame(() => {
    coreRef.current.rotation.z += 0.005;
    spiralRef.current.rotation.z += 0.002;
  });

  return (
    <>
      <group ref={coreRef}>
        {coreStars.map((particle, i) => {
          if (particle.type === "haze") {
            return (
              <Haze
                key={i}
                position={particle.position}
                camera={camera}
                color={particle.color}
              />
            );
          } else {
            return (
              <mesh key={i} position={particle.position} scale={particle.size}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  attach="material"
                  color={particle.color}
                />
              </mesh>
            );
          }
        })}
      </group>
      <group ref={spiralRef}>
        {spiralStars.map((particle, i) => {
          if (particle.type === "haze") {
            return (
              <Haze
                key={i}
                position={particle.position}
                camera={camera}
                color={particle.color}
              />
            );
          } else {
            return (
              <mesh key={i} position={particle.position} scale={particle.size}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  attach="material"
                  color={particle.color}
                />
              </mesh>
            );
          }
        })}
      </group>
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

const HeaderButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute;
  right: ${(props) => props.right};
  top: 50px;
  font-family: "GalacticFont";
  font-size: 30px;
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

const CoolDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute;
  right: 5vw;
  top: 50px;
  font-family: "GalacticFont";
  font-size: 30px;
  font-weight: 700;
  padding: 7px 7px;
  text-align: center;
  cursor: default;
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
