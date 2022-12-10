import "./style.css";
import * as THREE from "three";
import { forwardEuler, getAttractor } from "./attractors";
import { createLine, updateLine } from "./line";
import { range } from "./utils";
import { setupScene } from "./scene";

const numParticles = 500;
const lineLength = 100;

const { scene, update } = setupScene();

const lines = range(numParticles).map(() => createLine(lineLength));
lines.forEach((l) => scene.add(l));

const attractor = getAttractor();

const forwardEulerLine = (line: THREE.Line) => {
  const positions = line.geometry.attributes.position;
  const position = new THREE.Vector3(
    positions.getX(lineLength - 1),
    positions.getY(lineLength - 1),
    positions.getZ(lineLength - 1)
  );
  updateLine(line, forwardEuler(position, attractor, 0.005));
  positions.needsUpdate = true;
};

const animate = () => {
  requestAnimationFrame(animate);
  lines.forEach(forwardEulerLine);
  update();
};
animate();
