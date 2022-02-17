/* eslint-disable */
const {world} = require("@equal/ecs");

module.exports = {
    name: 'SimpleIteration',
    beforeAll() {
        world.registerComponent('ComponentA', {value: 0});
        world.registerComponent('ComponentB', {value: 0});
        world.registerComponent('ComponentC', {value: 0});
        world.registerComponent('ComponentD', {value: 0});
        world.registerComponent('ComponentE', {value: 0});

        world.registerSystem('SystemAB', ['ComponentA', 'ComponentB'], (entities) => {
            for (const entity of entities) {
                const componentA = world.getComponent(entity, 'ComponentA');
                const componentB = world.getComponent(entity, 'ComponentB');

                let x = componentA.value;
                componentA.value = componentB.value;
                componentB.value = x;
            }
        });

        world.registerSystem('SystemCD', ['ComponentC', 'ComponentD'], (entities) => {
            for (const entity of entities) {
                const componentC = world.getComponent(entity, 'ComponentC');
                const componentD = world.getComponent(entity, 'ComponentD');
                let x = componentC.value;
                componentC.value = componentD.value;
                componentD.value = x;
            }
        });


        world.registerSystem('SystemCE', ['ComponentC', 'ComponentE'], (entities) => {
            for (const entity of entities) {
                const componentC = world.getComponent(entity, 'ComponentC');
                const componentE = world.getComponent(entity, 'ComponentE');
                let x = componentC.value;
                componentC.value = componentE.value;
                componentE.value = x;
            }
        });

        for (let i = 0; i < 1000; i++) {
            {
                const entity = world.createEntity();
                world.addComponent(entity, 'ComponentA');
                world.addComponent(entity, 'ComponentB', {value: 1});
            }
            {
                const entity = world.createEntity();
                world.addComponent(entity, 'ComponentA');
                world.addComponent(entity, 'ComponentB', {value: 1});
                world.addComponent(entity, 'ComponentC', {value: 2});
            }
            {
                const entity = world.createEntity();
                world.addComponent(entity, 'ComponentA');
                world.addComponent(entity, 'ComponentB', {value: 1});
                world.addComponent(entity, 'ComponentC', {value: 2});
                world.addComponent(entity, 'ComponentD', {value: 3});
            }
            {
                const entity = world.createEntity();
                world.addComponent(entity, 'ComponentA');
                world.addComponent(entity, 'ComponentB', {value: 1});
                world.addComponent(entity, 'ComponentC', {value: 2});
                world.addComponent(entity, 'ComponentD', {value: 3});
                world.addComponent(entity, 'ComponentE', {value: 4});
            }
        }
    },
    measure() {
        world.tick(0);
    },
    afterAll() {
        world.unregisterSystem('SystemAB');
        world.unregisterSystem('SystemCD');
        world.unregisterSystem('SystemCE');
        world.unregisterComponent('ComponentA');
        world.unregisterComponent('ComponentB');
        world.unregisterComponent('ComponentC');
        world.unregisterComponent('ComponentD');
        world.unregisterComponent('ComponentE');
        world.destroyAllEntities();
        world.tick(0);
    },
};
