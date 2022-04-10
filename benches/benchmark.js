module.exports.Benchmark = class Benchmark {
  constructor(iterations = 10) {
    this.iterations = iterations;
    this.suites = [];
    this.results = {};
  }

  addSuite(suite) {
    this.suites.push(suite);

    return this;
  }

  run() {
    for (let i = 0; i < this.suites.length; i++) {
      const suite = this.suites[i];

      for (const bench of suite.benchs) {
        const result = this.process(bench);

        this.results[suite.name] = this.results[suite.name] || [];
        this.results[suite.name].push(result);
      }
    }

    const dataResult = Object.keys(this.results).reduce((data, suite) => {
      const benches = this.results[suite];

      for (const bench of benches) {
        data[bench.name] = data[bench.name] || {};

        data[bench.name][
          suite
        ] = `${bench.hz.toLocaleString()} op/s | ${bench.ms.toLocaleString()} ms/op`;
      }

      return data;
    }, {});

    console.log(`# Iterations: ${this.iterations}`);

    for (const bench in dataResult) {
      console.log(`\n## ${bench}:`);

      for (const suite in dataResult[bench]) {
        const data = dataResult[bench][suite];

        console.log(`\t- ${suite}:`);
        console.log(`\t\t${data}`);
      }
    }

    console.log();

    return this;
  }

  /**
   * @internal
   * @private
   */
  process(bench) {
    const ms = this.iterate(bench, this.iterations);

    return {
      name: bench.name,
      hz: ((this.iterations / ms) * 1_000) | 0,
      ms: Number((ms / this.iterations).toFixed(2)),
    };
  }

  /**
   * @internal
   * @private
   */
  iterate(bench, count) {
    const context = {};

    if (bench.beforeAll) {
      bench.beforeAll(context);
    }

    let elapsed = 0;

    for (let i = 0; i < count; i++) {
      if (bench.before) {
        bench.before(context);
      }

      const start = performance.now();
      bench.measure(context);
      const end = performance.now();

      elapsed += end - start;

      if (bench.after) {
        bench.after(context);
      }
    }

    if (bench.afterAll) {
      bench.afterAll(context);
    }

    return elapsed;
  }

  result() {
    return this.results;
  }
};
