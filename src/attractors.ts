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
  const k1 = attractor.velocity(transformedPosition);
  const k2 = attractor.velocity(
    transformedPosition.clone().addScaledVector(k1, attractor.delta / 2)
  );
  const k3 = attractor.velocity(
    transformedPosition.clone().addScaledVector(k2, attractor.delta / 2)
  );
  const k4 = attractor.velocity(
    transformedPosition.clone().addScaledVector(k3, attractor.delta)
  );
  return position
    .clone()
    .addScaledVector(k1, attractor.delta / 6)
    .addScaledVector(k2, attractor.delta / 6)
    .addScaledVector(k3, attractor.delta / 6)
    .addScaledVector(k4, attractor.delta / 6);
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

const fourWing = (): Attractor => ({
  scale: 8,
  translation: new Vector3(0, 0, 0),
  delta: 0.005,
  velocity: (position: Vector3): Vector3 => {
    const a = 0.2;
    const b = 0.01;
    const c = -0.4;
    const { x, y, z } = position;
    const dxdt = a * x + y * z;
    const dydt = b * x + c * y - x * z;
    const dzdt = -z - x * y;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const halvorsen = (): Attractor => ({
  scale: 25,
  translation: new Vector3(-4, -4, -2),
  delta: 0.0002,
  velocity: (position: Vector3): Vector3 => {
    const a = 1.89;
    const { x, y, z } = position;
    const dxdt = -a * x - 4 * y - 4 * z - y ** 2;
    const dydt = -a * y - 4 * z - 4 * x - z ** 2;
    const dzdt = -a * z - 4 * x - 4 * y - x ** 2;
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

const rabinovichFabrikant = (): Attractor => ({
  scale: 10,
  translation: new Vector3(0, 0, 3),
  delta: 0.0002,
  velocity: (position: Vector3): Vector3 => {
    const a = 0.14;
    const c = 0.1;
    let { x, y, z } = position;
    const dxdt = y * (z - 1 + x ** 2) + c * x;
    const dydt = x * (3 * z + 1 - x ** 2) + c * y;
    const dzdt = -2 * z * (a + x * y);
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

const scroll = (): Attractor => ({
  scale: 500,
  translation: new Vector3(0, 0, 50),
  delta: 0.0000005,
  velocity: (position: Vector3): Vector3 => {
    const a = 32.48;
    const b = 45.84;
    const c = 1.18;
    const d = 0.13;
    const e = 0.57;
    const f = 14.7;
    let { x, y, z } = position;
    const dxdt = a * (y - x) + d * x * z;
    const dydt = b * x - x * z + f * y;
    const dzdt = c * z + x * y - e * x ** 2;
    return new Vector3(dxdt, dydt, dzdt);
  },
});

const sprott = (): Attractor => ({
  scale: 4,
  translation: new Vector3(0.75, 0, 0),
  delta: 0.005,
  velocity: (position: Vector3): Vector3 => {
    const a = 2.07;
    const b = 1.79;
    let { x, y, z } = position;
    const dxdt = y + a * x * y + x * z;
    const dydt = 1 - b * x ** 2 + y * z;
    const dzdt = x - x ** 2 - y ** 2;
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
    fourWing,
    halvorsen,
    lorentz,
    rabinovichFabrikant,
    rossler,
    scroll,
    sprott,
    thomas,
  ])();
  return (p: Vector3) => integrate(p, attractor);
};
