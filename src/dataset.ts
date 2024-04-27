import fs from "fs";

const datasetRaw = fs.readFileSync("dataset.csv").toString("utf-8");
interface IData {
  period: number;
  time: number;
  week: number;
  date: number;
}
const line = datasetRaw.split("\r\n");
const weeks: number[] = [];
const allWeeks = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

const dataset = new Map<string, IData[]>();

for (let i = 0; i < line.length; i++) {
  const columns = line[i].split(",");
  if (i == 0) {
    columns.splice(0, 1);

    columns.forEach((week) => {
      weeks.push(allWeeks.indexOf(week));
    });
  } else {
    const name = columns[0].trim();
    columns.splice(0, 1);

    const data: IData[] = [];
    columns.forEach((raw, i) => {
      const [periodRaw, timeRaw] = raw.split("/");

      if (periodRaw == "" || timeRaw == "") return;

      data.push({
        period: Number(periodRaw),
        time: Number(timeRaw),
        week: weeks[i],
        date: weeks[i] + Math.floor(i / 7) * 7,
      });
    });
    dataset.set(name, data);
  }
}

export { dataset, IData };
