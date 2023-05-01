import React, { useRef, useEffect } from "react";
import { Vector3 } from "three";
import * as THREE from "three";

const GALAXY_THICKNESS = 2;
const CORE_X_DIST = 3;
const CORE_Y_DIST = 3;
const OUTER_CORE_X_DIST = 5;
const OUTER_CORE_Y_DIST = 5;
const ARM_X_DIST = 15;
const ARM_Y_DIST = 10;
const SPIRAL = 4.0;
const ARMS = 2.0;
const HAZE_MIN = 2;
const HAZE_MAX = 3;
const HAZE_OPACITY = 0.8;

function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return z * stdev + mean;
}

function spiral(x, y, z, offset) {
  let r = Math.sqrt(x ** 2 + y ** 2);
  let theta = offset;
  theta += x > 0 ? Math.atan(y / x) : Math.atan(y / x) + Math.PI;
  theta += (r / ARM_X_DIST) * SPIRAL;
  return new Vector3(r * Math.cos(theta), r * Math.sin(theta), z);
}

export function generateStars(numStars) {
  const coreStars = [];
  const spiralStars = [];
  const coreGenerator = (pos) => ({
    position: [pos.x, pos.y, pos.z],
    size: Math.random() * 0.15 + 0.05,
    color: "#f7e0ce",
  });

  const spiralGenerator = (pos) => ({
    position: [pos.x, pos.y, pos.z],
    size: Math.random() * 0.15 + 0.05,
    color: "skyblue",
  });

  for (let i = 0; i < numStars / 6; i++) {
    let pos = new THREE.Vector3(
      gaussianRandom(0, CORE_X_DIST),
      gaussianRandom(0, CORE_Y_DIST),
      gaussianRandom(0, GALAXY_THICKNESS)
    );
    let obj = coreGenerator(pos);
    coreStars.push(obj);
    coreStars.push({
      type: "haze",
      position: [pos.x, pos.y, pos.z],
      color: "#f7e0ce",
    });
  }

  for (let i = 0; i < numStars / 6; i++) {
    let pos = new THREE.Vector3(
      gaussianRandom(0, OUTER_CORE_X_DIST),
      gaussianRandom(0, OUTER_CORE_Y_DIST),
      gaussianRandom(0, GALAXY_THICKNESS)
    );
    let obj = coreGenerator(pos);
    coreStars.push(obj);
    coreStars.push({
      type: "haze",
      position: [pos.x, pos.y, pos.z],
      color: "#f7e0ce",
    });
  }

  for (let j = 0; j < ARMS; j++) {
    for (let i = 0; i < numStars / 1.5; i++) {
      let pos = spiral(
        gaussianRandom(ARM_X_DIST, ARM_X_DIST),
        gaussianRandom(0, ARM_Y_DIST),
        gaussianRandom(0, GALAXY_THICKNESS),
        (j * 2 * Math.PI) / ARMS
      );
      let obj = spiralGenerator(pos);
      spiralStars.push(obj);
      spiralStars.push({
        type: "haze",
        position: [pos.x, pos.y, pos.z],
        color: "rgb(135, 206, 235)",
      });
    }
  }

  return { coreStars, spiralStars };
}
