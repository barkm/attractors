export const range = (n: number) => [...Array(n).keys()];

export const randomChoice = <T>(array: Array<T>): T =>
  array[Math.floor(Math.random() * array.length)];
