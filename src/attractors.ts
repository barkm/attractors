import { Vector3 } from "three";
import { randomChoice } from "./utils";

interface Attractor {
  scale: number;
  translation: Vector3;
  delta: number;
  velocity: (p: Vector3) => Vector3;
}

const integrate = (position: Vector3, attractor: Attractor): Vector3 => {
  const transformedPosition = position
    .clone()
    .multiplyScalar(attractor.scale)
    .add(attractor.translation);
  const v = attractor.velocity(transformedPosition);
  return position.clone().addScaledVector(v, attractor.delta);
};

const aizawa = (): Attractor => ({
  scale: 3,
  translation: new Vector3(0, 0, 0.5),
  delta: 0.005 * 0.2,
  velocity: (position: Vector3): Vector3 => {
    const a = 0.95;
    const b = 0.7;
    const c = 0.65;
    const d = 3.5;
    const e = 0.25;
    const f = 0.1;
    let { x, y, z } = position;
    const dxdt = (z - b) * x - d * y;
    const dydt = d * x + (z - b) * y;
    const dzdt =
      c + a * z - z ** 3 / 3 - (x ** 2 + y ** 2) * (1 + e * z) + f * z * x ** 3;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const chen = (): Attractor => ({
  scale: 50,
  translation: new Vector3(0, 0, 0),
  delta: 0.0001,
  velocity: (position: Vector3): Vector3 => {
    const a = 5;
    const b = -10;
    const d = -0.38;
    const { x, y, z } = position;
    const dxdt = a * x - y * z;
    const dydt = b * y + x * z;
    const dzdt = d * z + (x * y) / 3;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const dadras = (): Attractor => ({
  scale: 30,
  translation: new Vector3(0, 0, 0),
  delta: 0.0001,
  velocity: (position: Vector3): Vector3 => {
    const a = 3;
    const b = 2.7;
    const c = 1.7;
    const d = 2;
    const e = 9;
    const { x, y, z } = position;
    const dxdt = y - a * x + b * y * z;
    const dydt = c * y - x * z + z;
    const dzdt = d * x * y - e * z;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const lorentz = (): Attractor => ({
  scale: 70,
  translation: new Vector3(0, 0, 30),
  delta: 0.005 ** 2,
  velocity: (position: Vector3): Vector3 => {
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;
    const { x, y, z } = position;
    const dxdt = sigma * (y - x);
    const dydt = x * (rho - z) - y;
    const dzdt = x * y - beta * z;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const rossler = (): Attractor => ({
  scale: 40,
  translation: new Vector3(0, 0, 10),
  delta: 0.00025,
  velocity: (position: Vector3): Vector3 => {
    const a = 0.2;
    const b = 0.2;
    const c = 5.7;
    const { x, y, z } = position;
    const dxdt = -(y + z);
    const dydt = x + a * y;
    const dzdt = b + z * (x - c);
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const thomas = (): Attractor => ({
  scale: 10,
  translation: new Vector3(0, 0, 0),
  delta: 0.01,
  velocity: (position: Vector3): Vector3 => {
    const b = 0.208186;
    const { x, y, z } = position;
    const dxdt = Math.sin(y) - b * x;
    const dydt = Math.sin(z) - b * y;
    const dzdt = Math.sin(x) - b * z;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

export const getAttractor = (): ((p: Vector3) => Vector3) => {
  const attractor = randomChoice([
    aizawa,
    chen,
    dadras,
    lorentz,
    rossler,
    thomas,
  ])();
  return (p: Vector3) => integrate(p, attractor);
};
