const A = [ 
  [ 8.3, 2.82, 4.1, 1.9 ],
  [ 0, 7.118144578313252, 6.643614457831326, 1.5626506024096387 ],
  [ 0, -0.11295681186283613, 0.35177201112140644, 0.046663577386468535 ],
  [ 0, -0.20709217936836088, -2.11416838953447, 5.846091110002138 ] 
]

const b = [
  -10.45,
  17.14542168674699,
  4.961350324374415,
  -12.567731874242533
];

const precision = 0.000001;
const length = A.length;
const x = [];
x[0] = Array.from({ length: A.length }, () => 0);
let k = 0;

function firstSum(i) {
  let sum = 0;
  for (let j = 0; j < i; j++) {
    sum += (A[i][j] * x[k + 1][j]) / A[i][i];
  }
  return sum;
}

function secondSum(i) {
  let sum = 0;
  for (let j = i + 1; j < length; j++) {
    sum += (A[i][j] * x[k][j]) / A[i][i];
  }
  return sum;
}

function endPoint() {
  let maxVal = 0;
  for (let j = 0; j < length; j++) {
    const val = Math.abs(x[k+1][j] - x[k][j]);
    maxVal = Math.max(maxVal, val);
  }
  return (maxVal < precision);
}

function solve() {
  let condition = true;
  let iteration = 0;
  while (condition) {
    iteration++;
    x[k + 1] = [];
    for (let i = 0; i < length; i++) {
      x[k + 1][i] = -firstSum(i) - secondSum(i) + b[i]/A[i][i];
    }
    if (endPoint()) {
      condition = false;
    } else {
      k++;
    }
  }

  return iteration;
}

const iteration = solve();
const solution = x[x.length - 1];

const intermidiateRes = x
  .map(arr => arr.map(item => item.toFixed(6)))
  .map((arr, index) => `iteration ${index}: [ ${arr} ]`.split(',').join(', '))
  .join('\n');
console.log(intermidiateRes);

let r = [];
for (let iterator = 1; iterator < 21; iterator++) {
  r[iterator] = [];
  for (let i = 0; i < length; i++) {
    r[iterator][i] = b[i];
    for (let j = 0; j < length; j++) {
      r[iterator][i] -= A[i][j] * x[iterator][j];
    }
  }
}

console.log(
  r
  .map(arr => arr.map(item => item.toFixed(6)))
  .map((arr, index) => `r[${index}] = [ ${arr.join(', ')} ]`)
  .join('\n')  
);

console.log(solution.map(item => item.toFixed(7)));
console.log({ iteration });