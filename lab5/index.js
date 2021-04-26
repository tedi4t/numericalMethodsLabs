class Bisection {
  constructor(a, b, precision, solveFunc) {
    this.a = a;
    this.b = b;
    this.precision = precision;
    this.func = solveFunc;
  }

  precisionFunc(a, b) {
    return Math.abs(a - b) < this.precision;
  }

  solve() {
    let ak = this.a;
    let bk = this.b;
    let iteration = 0;
    
    while(!this.precisionFunc(ak, bk)) {
      iteration++;
      const xMidlle = (ak + bk) / 2;
      const funcMiddle = this.func(xMidlle);
  
      if (funcMiddle === 0) 
        return xMidlle;
      
      const funcA = this.func(ak);
      const funcB = this.func(bk);
  
      if (funcA * funcMiddle > 0) {
        ak = xMidlle;
      } else {
        bk = xMidlle;
      }
    }
  
    return {
      interval: [ak, bk],
      iteration
    };
  }
}

class Chord {
  // derivative
  constructor(a, b, precision, funcs) {
    this.a = a;
    this.b = b;
    this.precision = precision;
    Object.assign(this, funcs);
  }

  precisionFunc(a, b) {
    return Math.abs(a - b) < this.precision;
  }

  solve() {
    let iteration = 0;
    let item1;
    let item2;
    const xValues = [];
    const x = Math.random() * Math.abs(this.a - this.b) + Math.min(this.a, this.b);
    const firstDerivativeVal = this.firstDerivative(x);
    const secondDerivativeVal = this.secondDerivative(x);

    if (firstDerivativeVal * secondDerivativeVal > 0) {
      xValues.push(this.b, this.a);
      item1 = b;
      item2 = a;
    } else {
      xValues.push(this.a, this.b);
      item1 = a;
      item2 = b;
    }
    
    while (!this.precisionFunc(item1, item2)) {
      iteration++;
      const xValuesCopy = [...xValues];
      const len = xValuesCopy.length;
      const first = xValuesCopy[0];  
      const last = xValuesCopy[len - 1];
      const funcFirst = this.func(first);
      const funcLast = this.func(last);

      const value = last - funcLast * (last - first) / (funcLast - funcFirst);
      xValues.push(value);
      item1 = last;
      item2 = value;
    }

    return {
      interval: [xValues[xValues.length - 2], xValues[xValues.length - 1]],
      iteration
    };
  }
}

class Newton {
  // derivative
  constructor(a, b, precision, funcs) {
    this.a = a;
    this.b = b;
    this.precision = precision;
    this.firstDerivative = funcs.firstDerivative;
    this.secondDerivative = funcs.secondDerivative;
    this.func = funcs.func;
  }

  precisionFunc(a, b) {
    return Math.abs(a - b) < this.precision;
  }

  solve() {
    let condition = true;
    let iteration = 0;
    const xValues = [];
    const x = this.b === 0 ? 1 : this.b;
    const firstDerivativeVal = this.firstDerivative(x);
    const secondDerivativeVal = this.secondDerivative(x);

    if (firstDerivativeVal * secondDerivativeVal > 0) {
      xValues.push(this.b);
    } else {
      xValues.push(this.a);
    }
    
    while (condition) {
      iteration++;
      const xValuesCopy = [...xValues];
      const len = xValuesCopy.length;
      const last = xValuesCopy[len - 1];
      const funcLast = this.func(last);
      const derivative = this.firstDerivative(last);
      
      const value = last - funcLast / derivative;
      xValues.push(value);

      condition = !this.precisionFunc(last, value);
    }


    return {
      interval: [xValues[xValues.length - 2], xValues[xValues.length - 1]],
      iteration
    };
  }
}

const findValue = coefs => x => {
  let result = 0;
  [...coefs].reverse().map((item, index) => {
    result += item * (x ** index);
  })

  return result;
}

const findDireative = (coefs, power) => {
  let deriativeCoefs = [...coefs];

  for (let i = 0; i < power; i++) {
    deriativeCoefs = deriativeCoefs
      .reverse()
      .map((item, index) => {
        return item * index;
      })
      .reverse();
    deriativeCoefs.pop();
  }

  return findValue(deriativeCoefs);
}

const coefs = [6, -3, 1, 2, -4, 7];
const solveFunc = findValue([...coefs]);

const firstDerivative = findDireative([...coefs], 1);
const secondDerivative = findDireative([...coefs], 2);

const funcs = {
  firstDerivative,
  secondDerivative,
  func: solveFunc,
}

const a = -10;
const b = +10;
const precision = 0.000001;
const args = [a, b, precision];

const bisection = new Bisection(...args, solveFunc);
const intervalBisection = bisection.solve();

const chord = new Chord(...args, funcs);
const intervalChord = chord.solve();

const newton = new Newton(...args, funcs);
const intervalNewton = newton.solve();

console.log(intervalBisection);
console.log(intervalChord);
console.log(intervalNewton);
