import { dataset } from "./dataset";
import { makeModel } from "./model";
import { getC, getT0, predict } from "./predict";

makeModel().then((model) => {
  const data = dataset.get("ㅛㅎㅎ");
  if (!data) throw new Error("no data were detected");

  let c: number = 2;
  for (let i = 0; i < data.length; i++) {
    const dataSample = data.slice(0, i + 1);
    const T0 = getT0(model, data[i].week, data[i].date);
    c = getC(T0, dataSample);
    const [period, time] = predict(c * T0, dataSample);

    console.log(data[i]);
    console.log(
      `Period Error: ${Math.abs(
        data[i].period - period
      )}, Time Error: ${Math.abs(data[i].time - time)}, T0: ${T0}`
    );
    console.log();
  }

  const T0 = getT0(model, 6, data[data.length - 1].date + 1);
  const [period, time] = predict(c * T0, data);

  console.log(`Predicted Period: ${period}, Predicted Time: ${time}`);
  console.log(`T0: ${T0}, c: ${c}`);
});
