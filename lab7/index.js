const hStart = 0.1;
let h = 0.1;
const interval = {
  start: 0,
  end: 2
}
const yStart = 0;
const eps = 0.03;

function yStroke(x, y) {
  const result = (Math.cos(y)) / (2.2 + x) + y**2;
  return result;
}

// --- Runge Kutta ---

function findK(x, y) {
  const k1 = yStroke(x, y);
  const k2 = yStroke(x + h/2, y + h * k1 / 2);
  const k3 = yStroke(x + h/2, y + h * k2 / 2);
  const k4 = yStroke(x + h, y + h*k3);
  if (Math.abs((k2 - k3) / (k1 - k2)) > eps) {
    h = h / 2;
  }
  return { k1, k2, k3, k4 };
}

function yNext (x, y) {
  const { k1, k2, k3, k4 } = findK(x, y);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

function epsilon (x, y) {
  const { k1, k2, k3, k4 } = findK(x, y, h);
  const yNextVal = yNext(x, y, h);
  const result = (1/6) * (k1 + 2*k2 + 2*k3 + k4) - (yNextVal - y) / h;
  return result;
}

function getAllYRunge (interval) {
  const results = [
    {
      x: interval.start,
      y: yStart,
      epsilon: epsilon(interval.start, yStart),
    }
  ];

  for (let x = interval.start + h; x < interval.end; x += h) {
    const prevX = results[results.length - 1].x;
    const prevY = results[results.length - 1].y;
    const y = yNext(prevX, prevY);
    results.push({
      x, 
      y,
      epsilon: epsilon(x, y),
    })
  }

  return results;
}

const resultsRunge = getAllYRunge(interval);

// --- Adamsa ---

function getYAdams(results, h, xStart) {
  const x = xStart + h;
  const lastIndex = results.length - 1;
  let adder1 = 55 * yStroke(results[lastIndex].x, results[lastIndex].y);
  let adder2 = -59 * yStroke(results[lastIndex - 1].x, results[lastIndex - 1].y);
  let adder3 = 37 * yStroke(results[lastIndex - 2].x, results[lastIndex - 2].y);
  let adder4 = -9 * yStroke(results[lastIndex - 3].x, results[lastIndex - 3].y);
  const yEcstr = results[lastIndex].y + (h / 24) * (adder1 + adder2 + adder3 + adder4);
  adder1 = 9 * yStroke(x, yEcstr);
  adder2 = 19 * yStroke(results[lastIndex].x, results[lastIndex].y);
  adder3 = -5 * yStroke(results[lastIndex - 1].x, results[lastIndex - 1].y);
  adder4 = yStroke(results[lastIndex - 2].x, results[lastIndex - 2].y);
  const yInter = results[lastIndex].y + (h / 24) * (adder1 + adder2 + adder3 + adder4);
  return { yEcstr, yInter };
}

function getAllYAdams (interval, resultsRunge) {
  const results = resultsRunge.slice(0, 4);
  // results.forEach(result => {
  //   result.q = yStroke(result.x, result.y);
  // })

  h = hStart;
  
  for (let x = results[3].x; x <= interval.end + eps;) {
    let { yEcstr, yInter } = getYAdams(results, h, x);
    if (Math.abs(yEcstr - yInter) > eps) {
      h = h / 2;
      const yRes = getYAdams(results, h, x);
      yEcstr = yRes.yEcstr; 
      yInter = yRes.yInter;
    }

    const epsillonAdams = (yEcstr - getYAdams(results, h / 2, x).yEcstr) / (15);

    results.push({
      x,
      y: yEcstr,
      epsilon: epsillonAdams
    })
    x += h;
  }
return results;
}

const resultsAdams = getAllYAdams(interval, resultsRunge);

console.log('--- Results Runge ---');
console.table(resultsRunge)
console.log('\n--- Results Adams ---');
console.table(resultsAdams);