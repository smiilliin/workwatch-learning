import fs from "fs";
import tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";
import { dataset } from "./dataset";

async function makeModel(): Promise<tf.LayersModel> {
  if (fs.existsSync("model.h5")) {
    return tf.loadLayersModel("file://./model.h5/model.json");
  }

  const model = tf.sequential();

  model.add(
    tf.layers.dense({ units: 250, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 175, activation: "relu" }));
  model.add(tf.layers.dense({ units: 150, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["accuracy"],
  });

  const monkey = dataset.get("원숭이");
  if (!monkey) throw new Error("no monkey");

  const xs = tf.tensor2d(
    monkey.slice(0, 22).map((data) => [data.week, data.date])
  );
  const ys = tf.tensor2d(monkey.slice(0, 22).map((data) => [data.period]));

  await model.fit(xs, ys, {
    batchSize: 4,
    epochs: 1000,
    shuffle: true,
  });

  await model.save("file://./model.h5");
  return model;
}

export { makeModel };
