import { Gene, GeneticCore } from "@smiilliin/genetic-algorithm";
import { IData } from "./dataset";
import tf from "@tensorflow/tfjs";

function w(x: number, cT0: number) {
  return x < 0 ? 1 : x > cT0 ? 0 : 2 - Math.pow(2, x / cT0);
}

function getT(w: (x: number) => number, X: number[], Y: number[]) {
  let a = 0,
    b = 0;
  for (let i = 0; i < X.length; i++) {
    const weight = w(Y[i]);

    a += weight * X[i];
    b += weight;
  }
  return a / b;
}
function getTime(w: (x: number) => number, Y: number[], Z: number[]) {
  let a = 0,
    b = 0;
  for (let i = 0; i < Y.length; i++) {
    const weight = w(Y[i]);

    a += weight * Z[i];
    b += weight;
  }
  return a / b;
}

function TScore(x: number) {
  return Math.pow(13, -((1 / 40) * x - 2));
}
function TimeScore(x: number) {
  return Math.pow(3, -((1 / 3) * x - 4));
}

function cFunction(x: number) {
  return ((1 / 8 - 5) / 63) * (x - 1) + 5;
}
function getXYZ(cT0: number, data: IData[]) {
  const X: number[] = [],
    Y: number[] = [],
    Z: number[] = [];

  let sumX = 0;
  let left = cT0;
  for (let i = data.length - 1; i >= 0; i--) {
    const x = data[i].period;

    left -= x;
    if (left < 0) break;

    sumX += x;

    X.push(x);
    Y.push(sumX);
    Z.push(data[i].time);
  }
  return [X, Y, Z];
}
function getWeightFunction(cT0: number) {
  return (x: number) => w(x, cT0);
}

/**
 * predict peroid value by deep learning model
 * @param model deep learning model
 * @param week week
 * @param date date
 * @returns peroid
 */
function getT0(model: tf.LayersModel, week: number, date: number): number {
  const prediction = model.predict(
    tf.tensor2d([[week, date]])
  ) as tf.Tensor<tf.Rank>;

  const T0 = (prediction.arraySync() as number[][])[0][0];
  return T0;
}
/**
 * get c constant
 * @param T0 predicted peroid by deep learning
 * @param data data sample
 * @returns c value
 */
function getC(T0: number, data: IData[]): number {
  const current = data.length - 1;
  const currentPeriod = data[current].period;
  const currentTime = data[current].time;

  const f = (gene: Gene) => {
    const c = cFunction(gene.toNumber(6));
    const cT0 = c * T0;
    const [X, Y, Z] = getXYZ(cT0, data);

    if (X.length == 0 || Y[Y.length - 1] > cT0) return 0.001;

    return (
      TScore(Math.abs(currentPeriod - getT(getWeightFunction(cT0), X, Y))) +
      TimeScore(Math.abs(currentTime - getTime(getWeightFunction(cT0), Y, Z)))
    );
  };

  const geneticCore = new GeneticCore(6, 100, 50, 0.04);

  for (let i = 0; i < 100; i++) {
    geneticCore.stepGeneration(f);
  }
  const [gene] = geneticCore.get(f);

  const c = cFunction(gene.toNumber(6));

  return c;
}
/**
 * predict peroid and time
 * @param cT0 c * predicted peroid by deep learning
 * @param data data sample
 * @returns [predicted peroid, predicted time]
 */
function predict(cT0: number, data: IData[]): number[] {
  const [X, Y, Z] = getXYZ(cT0, data);

  return [
    getT(getWeightFunction(cT0), X, Y),
    getTime(getWeightFunction(cT0), Y, Z),
  ];
}

export { getT0, getC, predict };
