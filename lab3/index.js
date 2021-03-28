'use strict';

const A = [
  [6.61, 1.12, 0.95, 1.195],
  [1.12, 3.83, 1.30, 0.16],
  [0.95, 1.30, 5.87, 2.10],
  [1.195, 0.16, 2.10, 5.77],
];

let operation = 0;

function genDiagonal(size) {
  return Array.from({ length: size }, 
    (arr, row) => Array.from({ length: size }, (item, column) => {
      return row === column ? 1 : 0;
    })
  );
}

function genM(order, A) {
  const size = A.length;
  const nextRowInd = order + 1;
  const diagonal = genDiagonal(size);
  const orderRow = diagonal[order];
  const prevDiagonalItem = A[nextRowInd][order];
  orderRow.forEach((elem, index) => {
    const item = (order === index) ? 1 : -A[nextRowInd][index];
    orderRow[index] = item / prevDiagonalItem;
  })
  return diagonal;
}

function genMReversal(order, A) {
  const size = A.length;
  const nextRowInd = order + 1;
  const diagonal = genDiagonal(size);
  diagonal[order] = A[nextRowInd];
  return diagonal;
}

function multipleMatrix(...matrixes) {
  operation++;
  const matrix1 = matrixes.splice(0, 1)[0];
  const matrix2 = matrixes.splice(0, 1)[0];
  const matrix1Len = matrix1.length;
  const matrix2Len = matrix2.length;
  const resultMatrixColNumb = matrix2[0].length;
  const resultMatrix = Array.from({ length: matrix1Len },
     () => Array.from({ length: resultMatrixColNumb }, () => 0)
    );
  if (matrix1[0].length !== matrix2.length) {
    console.dir({ operation, matrix1, m1l: matrix1.length, matrix2, m2l: matrix2.length }, { depth: null });
    throw new Error('Wrong matrix sizes');
  }
  for (let row = 0; row < matrix1Len; row++) {
    for (let i = 0; i < resultMatrixColNumb; i++) {
      for (let j = 0; j < matrix2Len; j++) {
        resultMatrix[row][i] += matrix1[row][j] * matrix2[j][i];
      }
    }
  }
  return matrixes.length === 0 ? resultMatrix : multipleMatrix(resultMatrix, ...matrixes);
}

function genFrobenius(A) {
  // const m = [];
  // const mReversal = [];
  // const size = A.length;
  // for (let order = 0; order < size - 1; order++) {
  //   m.push(genM(order, A));
  //   mReversal.push(genMReversal(order, A));
  // }
  // m.reverse();
  // return multipleMatrix(...mReversal, A, ...m);

  // ----------------

  const size = A.length;
  for (let order = size - 2; order >=0; order--) {
    const m = genM(order, A);
    const mReversal = genMReversal(order, A);
    console.log({
      order,
      m: m
        .map(arr => arr
          .map(item => item.toFixed(2))), 
      mReversal: mReversal
        .map(arr => arr
          .map(item => item.toFixed(2)))
    })
    A = multipleMatrix(mReversal, A, m);  
  }
  return A;
}

const matrix1 = [
  [2, 5],
  [6, 7],
  [1, 8],
]

const matrix2 = [
  [1, 2, 1],
  [0, 1, 0],
]

// console.log(multipleMatrix(matrix1, matrix2));
const frobenius = genFrobenius(A);
console.log(
  frobenius
    .map(arr => arr
      .map(item => item.toFixed(2)))
);

// console.log(genMReversal(2, A));

// console.clear();
// console.log(genM(2, A));