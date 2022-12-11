import "./style.css";
import * as THREE from "three";
import { getAttractor } from "./attractors";
import { createLine, updateLinePosition } from "./line";
import { range } from "./utils";
import { setupScene } from "./scene";

const numLines = 500;
const lineLength = 100;

const { scene, update } = setupScene();

const lines = range(numLines).map(() => createLine(lineLength));
lines.forEach((l) => scene.add(l));

const attractor = getAttractor();

const updateLine = (line: THREE.Line, opacity: number) => {
  const positions = line.geometry.attributes.position;
  const position = new THREE.Vector3(
    positions.getX(lineLength - 1),
    positions.getY(lineLength - 1),
    positions.getZ(lineLength - 1)
  );
  updateLinePosition(line, attractor(position));
  positions.needsUpdate = true;
  (line.material as THREE.LineBasicMaterial).opacity = opacity;
};

const updateLines = (opacity: number) =>
  lines.forEach((l) => updateLine(l, opacity));

const numBurnInSteps = 1000;
range(numBurnInSteps).forEach(() => updateLines(0));

const numFadeInSteps = 100;
let step = 0;
const animate = () => {
  requestAnimationFrame(animate);
  updateLines(Math.min(step / numFadeInSteps, 1) ** 2);
  update();
  step++;
};
animate();
