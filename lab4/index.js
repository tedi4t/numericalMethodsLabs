const xValues = [ -2, 0, 2, 4 ];

function findY(x) {
	const alpha = 3;
  return (x * x / 15) + Math.cos(x + alpha);
}

// const xValues = [ 2, 3, 5, 7 ];

// function findY(x) {
// 	const values = {
// 		2: 4,
// 		3: -2,
// 		5: 6,
// 		7: -3
// 	};

// 	return values[x];
// }

function generateMatrixLeft(xValues) {
	const len = xValues.length;
	const matrix = Array.from({ length: len }, () => []);

	for (const rowNumber in matrix) {
		const row = matrix[rowNumber];
		const x = xValues[rowNumber];
		row.push(...Array.from({ length: len }, (item, index) => {
			return x ** (index);
		}))
	}

	return matrix;
}

const matrixLeft = generateMatrixLeft(xValues);
const matrixRight = xValues.map(findY);
console.log('x values:');
console.log(matrixLeft);
console.log('\ny values:');
console.log(matrixRight);

// Solution

function findMaxMatrixItem(matrix, removedRows = [], removedColumns = []) {
	let maxItem = {
		value: -10000000,
		row: 0, 
		column: 0,
	};

	matrix.forEach((row, rowNumber) => {
		row.forEach((item, colNumber) => {
			if (item > maxItem.value && !removedRows.includes(rowNumber) && !removedColumns.includes(colNumber)) {
				Object.assign(maxItem, {
					value: item,
					row: rowNumber,
					column: colNumber
				});
			}
		})
	});

	return maxItem;
}

function substractSystem(matrixLeft, matrixRight, maxItem) {
	const { 
		value: maxValue,
		row: maxRowIndex,
		column: maxColIndex
	} = maxItem;

	for (const rowIndex in matrixLeft) {
		if (rowIndex != maxRowIndex) {
			const mRow = matrixLeft[rowIndex][maxColIndex] / maxValue;
			for (const itemIndex in matrixLeft[rowIndex]) {
				matrixLeft[rowIndex][itemIndex] -= mRow * matrixLeft[maxRowIndex][itemIndex];
			}
			matrixRight[rowIndex] -= mRow * matrixRight[maxRowIndex];
		}
	}
}

function reduceSystem(matrixLeft, matrixRight) {
	const removedRows = [];
	const removedColumns = [];
	const length = matrixLeft.length;

	for (let i = 0; i < length; i++) {
		const maxItem = findMaxMatrixItem(matrixLeft, removedRows, removedColumns);
		removedRows.push(maxItem.row);
		removedColumns.push(maxItem.column);
		substractSystem(matrixLeft, matrixRight, maxItem);

		// console.log(maxItem)
		// console.log(matrixLeft);
		// console.log(matrixRight);
		// console.log('\n\n');
	}
}

function solveReducedSystem(matrixLeft, matrixRight) {
	const solutions = [];
	const precision = 0.000001;

	for (const rowNumber in matrixLeft) {
		for (const colNumber in matrixLeft[rowNumber]) {
			const item = matrixLeft[rowNumber][colNumber];
			if (Math.abs(item) > precision) {
				solutions[colNumber] = matrixRight[rowNumber] / item;
			}
		}
	}

	return solutions;
}

function solveSystem(matrixLeft, matrixRight) {
	const matrixLeftClone = matrixLeft.map(arr => [...arr]);
	matrixRightClone = [...matrixRight];	

	reduceSystem(matrixLeftClone, matrixRightClone);
	const solution = solveReducedSystem(matrixLeftClone, matrixRightClone);
	
	return solution;
}

const solution = solveSystem(matrixLeft, matrixRight);
console.log('\n\nSolution');
console.log(`P(x) = ${solution.map((item, index) => item + ` * x^${index}`).join(' + ')}`);

const getValueOnPolynom = coefs => value => {
	let result = 0;
	coefs.forEach((coef, index) => result += coef * (value ** index))
	return result;
}

function findEpsilon() {
	console.log('\n\n----epsiilon----');
	const polynom = getValueOnPolynom(solution);
	for (let x of xValues) {
		const yFromFunction = findY(x);
		const yFromPolynom = polynom(x);
		console.log({
			x,
			epsilon: Math.abs(yFromPolynom - yFromFunction)
		})
	}
}

findEpsilon();


// ----- Splines -----


const getH = (xValues, i) => xValues[i + 1] - xValues[i];
const getEmptyCoefArr = len => Array.from({ length: (len - 1) * 3 }, () => 0);

function buildSplineMatrix(xValues) {
	const yValues = xValues.map(findY);
	const len = xValues.length;
	const bIndexStart = 0;
	const cIndexStart = 3;
	const dIndexStart = 6;

	const leftPart = [];
	const rigthPart = [];
	
	// first equation
	for (let i = 0; i < len - 1; i++) {
		const coefs = getEmptyCoefArr(len);
		coefs[bIndexStart + i] = getH(xValues, i);
		coefs[cIndexStart + i] = getH(xValues, i) ** 2;
		coefs[dIndexStart + i] = getH(xValues, i) ** 3;
		leftPart.push(coefs);
		rigthPart.push(yValues[i + 1] - yValues[i]);
	}

	// second equation
	for (let i = 0; i < len - 2; i++) {
		const coefs = getEmptyCoefArr(len);
		coefs[bIndexStart + i + 1] = 1;
		coefs[bIndexStart + i] = -1;
		coefs[cIndexStart + i] = -2 * getH(xValues, i);
		coefs[dIndexStart + i] = -3 * (getH(xValues, i) ** 2);
		leftPart.push(coefs);
		rigthPart.push(0);
	}

	// third equation
	for (let i = 0; i < len - 2; i++) {
		const coefs = getEmptyCoefArr(len);
		coefs[cIndexStart + i + 1] = 1;
		coefs[cIndexStart + i] = -1;
		coefs[dIndexStart + i] = -3 * getH(xValues, i);
		leftPart.push(coefs);
		rigthPart.push(0);
	}

	// two single equations
	{
		const coefs = getEmptyCoefArr(len);
		coefs[cIndexStart] = 1;
		leftPart.push(coefs);
		rigthPart.push(0);
	}

	{
		const coefs = getEmptyCoefArr(len);
		coefs[cIndexStart + len - 2] = 1;
		coefs[dIndexStart + len - 2] = 3 * getH(xValues, len - 2);
		leftPart.push(coefs);
		rigthPart.push(0);
	}

	console.log('\n\nSplines left:');
	console.log(leftPart);
	console.log('\nSplines right:');
	console.log(rigthPart);

	return {
		matrixLeft: leftPart,
		matrixRight: rigthPart
	}
}

const splineSystem = buildSplineMatrix(xValues);
const solutionSpline = solveSystem(splineSystem.matrixLeft, splineSystem.matrixRight);
console.log('\nsplines solution:')
console.log(solutionSpline);

const len = xValues.length;
const yValues = xValues.map(findY);
const bIndexStart = 0;
const cIndexStart = 3;
const dIndexStart = 6;

console.log('\n\n--- spline system ---\n');

function serializeSplitePolynomial() {
	const precision = 3;

	for (let i = 0; i < len - 1; i++) {
		const number1 = solutionSpline[bIndexStart + i];
		const number2 = solutionSpline[cIndexStart + i];
		const number3 = solutionSpline[dIndexStart + i];
		const number4 = yValues[i];
		const number5 = -xValues[i];
		const number1Serialized = number1 >= 0 ? `+${number1.toFixed(precision)}` : number1.toFixed(precision);
		const number2Serialized = number2 >= 0 ? `+${number2.toFixed(precision)}` : number2.toFixed(precision);
		const number3Serialized = number3 >= 0 ? `+${number3.toFixed(precision)}` : number3.toFixed(precision);
		const number4Serialized = number4.toFixed(precision);
		const number5Serialized = number5 >= 0 ? `+${number5.toFixed(0)}` : `${number5}`;
		console.log(`S${i}(x) = ${number4Serialized}${number1Serialized}*(x${number5Serialized})${number2Serialized}*(x${number5Serialized})^2${number3Serialized}*(x${number5Serialized})^3, x є [${xValues[i]}, ${xValues[i + 1]}]`);
	}
}

serializeSplitePolynomial();