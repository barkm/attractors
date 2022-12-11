import * as THREE from "three";
import { range } from "./utils";

export const createLine = (lineLength: number): THREE.Line => {
  const colors = new THREE.BufferAttribute(
    Float32Array.from(
      range(lineLength).flatMap((i) => [0, 0, 0, (0.75 * i) / lineLength])
    ),
    4
  );
  const position = new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(0.5),
    THREE.MathUtils.randFloatSpread(0.5),
    THREE.MathUtils.randFloatSpread(0.5)
  );
  const positions = Array(lineLength).fill(position);
  const geometry = new THREE.BufferGeometry().setFromPoints(positions);
  geometry.setAttribute("color", colors);
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthTest: false,
  });
  return new THREE.Line(geometry, material);
};

const shiftLeft = (collection: Float32Array, values: number[]) => {
  for (let i = 0; i < collection.length - values.length; i++) {
    collection[i] = collection[i + values.length];
  }
  for (let i = 1; i < values.length + 1; i++) {
    collection[collection.length - i] = values[values.length - i];
  }
};

export const updateLinePosition = (
  line: THREE.Line,
  position: THREE.Vector3
) => {
  const { x, y, z } = position;
  shiftLeft(line.geometry.attributes.position.array as Float32Array, [x, y, z]);
};
