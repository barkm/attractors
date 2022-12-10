import { Vector3 } from "three";
import { randomChoice } from "./utils";

const aizawa = (position: Vector3): Vector3 => {
  const a = 0.95;
  const b = 0.7;
  const c = 0.65;
  const d = 3.5;
  const e = 0.25;
  const f = 0.1;
  let { x, y, z } = position
    .clone()
    .multiplyScalar(3)
    .add(new Vector3(0, 0, 0.5));
  const dxdt = (z - b) * x - d * y;
  const dydt = d * x + (z - b) * y;
  const dzdt =
    c + a * z - z ** 3 / 3 - (x ** 2 + y ** 2) * (1 + e * z) + f * z * x ** 3;
  return position.add(
    new Vector3(dxdt, dydt, dzdt).multiplyScalar(0.005 * 0.2)
  );
};

const dadras = (position: Vector3): Vector3 => {
  const a = 3;
  const b = 2.7;
  const c = 1.7;
  const d = 2;
  const e = 9;
  const { x, y, z } = position.clone().multiplyScalar(30);
  const dxdt = y - a * x + b * y * z;
  const dydt = c * y - x * z + z;
  const dzdt = d * x * y - e * z;
  return position.add(new Vector3(dxdt, dydt, dzdt).multiplyScalar(0.0001));
};

const lorentz = (position: Vector3): Vector3 => {
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const { x, y, z } = position
    .clone()
    .multiplyScalar(70)
    .add(new Vector3(0, 0, 30));
  const dxdt = sigma * (y - x);
  const dydt = x * (rho - z) - y;
  const dzdt = x * y - beta * z;
  return position.add(
    new Vector3(dxdt, dydt, dzdt).multiplyScalar(0.005 * 0.005)
  );
};

const thomas = (position: Vector3): Vector3 => {
  const b = 0.208186;
  const { x, y, z } = position.clone().multiplyScalar(10);
  const dxdt = Math.sin(y) - b * x;
  const dydt = Math.sin(z) - b * y;
  const dzdt = Math.sin(x) - b * z;
  return position.add(new Vector3(dxdt, dydt, dzdt).multiplyScalar(0.01));
};

export const getAttractor = (): ((p: Vector3) => Vector3) => {
  return randomChoice([aizawa, dadras, lorentz, thomas]);
};
