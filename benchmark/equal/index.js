/* eslint-disable */
const Packed1 = require('./packed-1.bench');
const Packed5 = require('./packed-5.bench');
const SimpleIteration = require('./simple-iteration.bench');
const AddRemove = require('./add-remove.bench');

module.exports = {
    name: '@equal/ecs',
    benchs: [
        Packed1,
        Packed5,
        SimpleIteration,
        AddRemove,
    ],
};
