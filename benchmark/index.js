/* eslint-disable */
const {Benchmark} = require('./benchmark');
const equal = require('./equal');
const ecsy = require('./ecsy');

new Benchmark(1000)
    .addSuite(equal)
    .addSuite(ecsy)
    .run();
