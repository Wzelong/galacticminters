import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Line,
  Text,
  Trail,
  Octahedron,
  useCursor,
} from "@react-three/drei";
import styled from "styled-components";
import logo from "../../images/PlayerHomeLogo.png";
import { useAccountAddress } from "../../contexts/AccountAddrContext";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { generateStars, generatePlayerStars } from "./generateStars";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
const formatCooldownTime = (time) => {
  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const stars = generateStars(2000);
const Galaxy = (props) => {
  const setDisplayGalaxy = props.setDisplayGalaxy;
  const setPlanetID = props.setPlanetID;
  const setSceneLoaded = props.setSceneLoaded;
  const { accountAddress } = useAccountAddress();
  const [cooldownTime, setCooldownTime] = useState(null);
  const [playerPlanets, setPlayerPlanets] = useState([]);
  const [displayPlayerStars, setDisplayPlayerStars] = useState(false);
  const [playerStars, setPlayerStars] = useState([]);
  const getPlayerPlanets = async () => {
    const q = query(collection(db, "players", accountAddress, "planets"));
    await getDocs(q).then((querySnapshot) => {
      const stars = generatePlayerStars(
        querySnapshot.docs.map((doc) => doc.data())
      );
      setPlayerStars(stars);
    });
  };
  const handleGoHome = () => {
    setDisplayGalaxy(false);
    setPlanetID("0");
    setSceneLoaded(false);
  };
  const handleJump = async () => {
    setDisplayGalaxy(false);
    const number = Math.floor(Math.random() * 9).toString();
    setPlanetID(number);
    setSceneLoaded(false);
    const timestamp = Date.now();
    const cooldownDocRef = doc(db, "jumpCoolDowns", accountAddress);
    await setDoc(cooldownDocRef, { timestamp });
    const planetDocRef = doc(db, "players", accountAddress, "planets", number);
    const planetSnap = await getDoc(doc(db, "planets", number));
    await setDoc(planetDocRef, planetSnap.data());
  };
  const listenForCooldownUpdates = () => {
    const cooldownDocRef = doc(db, "jumpCoolDowns", accountAddress);
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
  const handleStarClick = () => {
    setDisplayPlayerStars(!displayPlayerStars);
  };
  useEffect(() => {
    const unsubscribe = listenForCooldownUpdates();
    getPlayerPlanets();
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
        <Logo src={logo} onClick={handleGoHome}></Logo>
        {cooldownTime !== null ? (
          <HeaderButton right={"15vw"} onClick={handleStarClick}>
            Stars
          </HeaderButton>
        ) : null}
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
        {displayPlayerStars ? (
          <>
            <PlayerStars
              stars={playerStars}
              setDisplayGalaxy={setDisplayGalaxy}
              setSceneLoaded={setSceneLoaded}
              setPlanetID={setPlanetID}
            />
            <EffectComposer multisampling={8}>
              <Bloom
                kernelSize={3}
                luminanceThreshold={0}
                luminanceSmoothing={0.4}
                intensity={0.2}
              />
            </EffectComposer>
          </>
        ) : (
          <SpiralGalaxy stars={stars} />
        )}
        <OrbitControls maxDistance={180} minDistance={80} />
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
/*
const findNearestNeighbor = (index, stars) => {
  let minDistance = Infinity;
  let nearestNeighbor = null;

  stars.forEach((star, i) => {
    if (i === index) return; // skip self

    const dx = star.position[0] - stars[index].position[0];
    const dy = star.position[1] - stars[index].position[1];
    const dz = star.position[2] - stars[index].position[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < minDistance) {
      minDistance = distance;
      nearestNeighbor = star;
    }
  });

  return nearestNeighbor;
};
*/
const PlayerStars = (props) => {
  const { stars, setDisplayGalaxy, setPlanetID, setSceneLoaded } = props;
  const starsRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  useEffect(() => {
    starsRef.current.rotation.x = -Math.PI / 4;
  }, []);

  useFrame(() => {
    if (!hovered) {
      starsRef.current.rotation.z += 0.005;
    }
  });

  const handleStarClick = (id) => {
    setDisplayGalaxy(false);
    setPlanetID(id);
    setSceneLoaded(false);
  };

  return (
    <group ref={starsRef}>
      {stars.map((particle, i) => {
        //const nearestNeighbor = findNearestNeighbor(i, stars);
        //const points = [particle.position, nearestNeighbor.position];
        return (
          <group key={i}>
            <Trail
              width={1} // Width of the line
              color={particle.color} // Color of the line
              length={50} // Length of the line
              decay={0.5} // How fast the line fades away
              local={false} // Wether to use the target's world or local positions
              stride={0} // Min distance between previous and current point
              interval={1} // Number of frames to wait before next calculation
              attenuation={(t) => {
                return t * t;
              }}
            >
              <Octahedron
                onPointerOver={() => {
                  setHovered(true);
                }}
                onPointerOut={() => {
                  setHovered(false);
                }}
                onClick={() => {
                  handleStarClick(particle.id.toString());
                }}
                position={particle.position}
                scale={particle.size}
                args={[6, 0]}
              >
                <meshStandardMaterial color={particle.color} />
              </Octahedron>
            </Trail>
            {/*<Line points={points} color={particle.color} />*/}
          </group>
        );
      })}
    </group>
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
  font-family: Arial Black, Arial Bold, Gadget, sans-serif;
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
