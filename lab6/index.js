const coefs = require('./coefs.json');

function func(x) {
  return Math.log10(x**2 + 1) / x;
}

function funcT(t) {
  return (Math.log10(0.16*t*t + 0.96*t + 2.44)) / (1.2 + 0.4*t);
}

function findIntegral(func, a, b, n) {
  const h = (b - a) / (2 * n);
  const step = (b - a) / n;
  const yItems = Array.from({ length: n + 1 }, (item, index) => {
    return func(a + index * step);
  })

  const firstBracket = yItems[0] + yItems[n];
  const secondBracket = yItems.reduce((acc, val, index) => (index === n) ? acc : acc + val);
  const thirdBracket = yItems.reduce((acc, val, index) => (index >= n - 1) ? acc : acc + val);
  const result = (h/3) * (firstBracket + 4 * secondBracket + 2 * thirdBracket);
  return result;
}

function transformToX(t) {
  return 1.2 + 0.4 * t;
}

function findGaus(func, n, a, b) {
  const aValues = coefs[n]["A"];
  const tValues = coefs[n]["x"];
  let result = 0;
  let len = aValues.length;
  for (let i = 0; i < n; i++) {
    const index = i % len;
    const t = tValues[index];
    const a = aValues[index];
    const tIndex = (i / len >= 1) ? -t : t;
    result += a * func(tIndex);
  }

  const multiplier = (b - a) / 2;
  result *= multiplier;

  return result;
}

const a = 0.8;
const b = 1.6;
const n = 500;
const nGaus = 2;

const result = findIntegral(func, a, b, n);
console.log(result);

const gausRes = findGaus(funcT, nGaus, a, b);
console.log(gausRes);

// const expected = 0.25397;
// const epsillon = 0.0001;
// let n = 3;
// while(1) {
//   const result = findIntegral(func, a, b, n);
//   const difference = Math.abs(result - expected);
//   if (difference < epsillon) {
//     console.log(n);
//     break;
//   }
//   n++;
// }