import { Benchmarks } from 'benchmarker-js';
import * as entity from './entity.bench';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
console.warn = function () {
  // noop
};

const benchmarks = new Benchmarks({
  summary: true,
  iterations: 1000,
});

entity.init(benchmarks);

benchmarks.run();
