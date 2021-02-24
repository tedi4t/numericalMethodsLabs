const A = [
  [5.68, 1.12, 0.95, 1.32, 0.83],
  [1.12, 3.78, 2.12, 0.57, 0.91],
  [0.95, 2.12, 6.63, 1.29, 1.57],
  [1.32, 0.57, 1.29, 4.07, 1.25],
  [0.83, 0.91, 1.57, 1.25, 5.71],
];

const B = [
  6.89,
  3.21,
  3.58,
  6.25,
  5.65,
];

const toFixedNumb = 6;

const n = A.length;
let T = Array.from({ length: n }, () => []);
let Ttransponated;
let y = [];
let x = [];

const tFirst = Math.sqrt(A[0][0]);

function tFirstRow(a) {
  return (a / tFirst);
}

function tDiagonal(a, rowIndex) {
  let sum = 0;
  for (let k = 0; k < rowIndex; k++) {
    sum += T[k][rowIndex] * T[k][rowIndex];
  }
  return Math.sqrt(a - sum);
}

function tItem(a, rowIndex, colIndex) {
  let sum = 0;
  for (let k = 0; k < rowIndex; k++) {
    sum += T[k][rowIndex] * T[k][colIndex];
  }
  return (a - sum) / T[rowIndex][rowIndex];
}

function transponate(matrix) {
  return matrix.map((arr, i) => arr.map((elem, j) => matrix[j][i]));
}

function findTMatrix() {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) {
        T[i][j] = tFirst;
      } else if (i === 0) {
        T[i][j] = tFirstRow(A[i][j]);
      } else if (i === j) {
        T[i][j] = tDiagonal(A[i][j], i)
      } else if (i > j) {
        T[i][j] = 0;
      } else {
        T[i][j] = tItem(A[i][j], i, j)
      }
    }
  }
}

findTMatrix();

T = T.map(arr => arr.map(item => Number(item.toFixed(toFixedNumb))));
Ttransponated = transponate(T);

function findYItem(b, rowIndex) {
  let sum = 0;
  for (let k = 0; k < rowIndex; k++) {
    sum += T[k][rowIndex] * y[k];
  }
  return (b - sum) / T[rowIndex][rowIndex];
}

function findYMatrix() {
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      y[i] = B[0] / tFirst;
    } else {
      y[i] = findYItem(B[i], i);
    }
  }
}

findYMatrix();

y = y.map(item => Number(item.toFixed(toFixedNumb)));

function findXItem(y, rowIndex) {
  let sum = 0;
  for (let k = rowIndex + 1; k < n; k++) {
    sum += T[rowIndex][k] * x[k];
  }
  return (y - sum) / T[rowIndex][rowIndex];
}

function findXMatrix() {
  for (let i = n - 1; i >= 0; i--) {
    if (i === n - 1) {
      const tLast = T[n - 1][n - 1];
      const yLast = y[n - 1];
      x[i] = yLast / tLast;
    } else {
      x[i] = findXItem(y[i], i);
    }
  }
}

findXMatrix();

x = x.map(item => Number(item.toFixed(toFixedNumb)));

console.log('Matrix T:');
console.log(T);

console.log('\nMatrix y:');
console.log(y);

console.log('\nMatrix x:');
console.log(x);
