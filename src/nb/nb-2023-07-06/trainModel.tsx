import { _never } from "../../utils/_never";
import { run } from "./run";
import * as tf from "@tensorflow/tfjs";


export async function trainModel({ runArgs }: {
    runArgs: Parameters<typeof run>[0];
}) {
    console.log({ runArgs });
    const theRun = run(runArgs);

    console.log({ "theRun.getState().length": theRun.getState().length });
    const batchSize = 5000;
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 250,
        activation: "relu",
        inputShape: [
            theRun.getState().length,
        ],
        batchSize,
    }));
    model.add(tf.layers.dense({ units: 175, activation: "relu" }));
    model.add(tf.layers.dense({ units: 250, activation: "relu" }));
    model.add(tf.layers.dense({ units: 250, activation: "relu" }));
    model.add(tf.layers.dense({ units: 250, activation: "relu" }));
    model.add(tf.layers.dense({ units: 250, activation: "relu" }));
    model.add(tf.layers.dense({ units: 4, activation: "softmax" }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: "sparseCategoricalCrossentropy",
        metrics: ["accuracy"],
    });

    if (runArgs.copilotModel) {
        model.setWeights(runArgs.copilotModel.model.getWeights());
    }

    await model.fitDataset(
        tf.data.generator(function* () {
            for (let i = 0; i < 10; i++) {
                const perfStart = performance.now();
                const xs = [];
                const ys = [];
                for (let j = 0; j < batchSize; j++) {
                    const xy = theRun.tick1();
                    if (!xy) { return; }
                    xs.push(xy.state);
                    ys.push(xy.direction);
                }
                const perfEnd = performance.now();
                console.log({
                    trainModel: "tickCount",
                    tickCount: theRun.tickCount,
                    perf: perfEnd - perfStart,
                });
                yield {
                    xs: tf.tensor(xs),
                    ys: tf.tensor(ys),
                };
            }
        }),
        {
            epochs: 1,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log({ trainModel: "onEpochEnd", epoch, logs });
                },
            },
        },
    );


    // const p = (model.predict(tf.tensor([[0, 1, 1]])) as tf.Tensor)
    // .dataSync();
    // console.log(p);

    return { model, id: Math.random().toString().slice(2) };
}
