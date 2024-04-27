# Workwatch-learning

This is the work period and work time prediction algorithm to be included in WorkWatch

## Explanation

Predict the peroid(T0) through deep learning and get the constant(c) through a genetic algorithm to predict a new peroid and time.

This program uses a dataset with period and time of 3 users (ㅛㅎㅎ, smiilliin, 원숭이) (./dataset.csv).

## Usage

### Main.ts:6

Input user name which you want to predict (ㅛㅎㅎ or smiilliin or 원숭이)

```ts
const data = dataset.get("ㅛㅎㅎ");
```

### Predict.ts - getT0

Predict peroid value by deep learning model

```ts
getT0(model: tf.LayersModel, week: number, date: number): number
```

### Predict.ts - getC

Get c constant

```ts
getC(T0: number, data: IData[]): number
```

### Predict.ts - predict

Predict peroid and time

```ts
predict(cT0: number, data: IData[]): number[]
```

## Install & Run

Install npm packages

```bash
npm install
```

Run this program on ts-node

```bash
npm run start
```

## Result

```bash
(...)

{ period: 23.8, time: 4, week: 1, date: 22 }
Period Error: 0, Time Error: 0, T0: 21.623716354370117

{ period: 24.3333333333333, time: 4, week: 2, date: 30 }
Period Error: 0, Time Error: 0, T0: 27.096704483032227

{ period: 31.3833333333333, time: 3, week: 3, date: 31 }
Period Error: 0, Time Error: 0, T0: 26.626272201538086

{ period: 20.55, time: 3, week: 4, date: 32 }
Period Error: 0, Time Error: 0, T0: 25.21939468383789

{ period: 23.95, time: 4, week: 5, date: 33 }
Period Error: 0, Time Error: 0, T0: 25.42426300048828

Predicted Period: 23.949999999999996, Predicted Time: 4
T0: 26.924203872680664, c: 1.2857142857142856
```
