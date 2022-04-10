/* eslint-disable */
const {world, exclude} = require("@equal/ecs");

module.exports = {
    name: 'Add Remove',
    beforeAll() {
        world.registerComponent('ComponentA', {});
        world.registerComponent('ComponentB', {});

        world.registerSystem('SystemA', ['ComponentA', exclude('ComponentB')], (entities) => {
            for (const entity of entities) {
                world.addComponent(entity, 'ComponentB');
            }
        });

        world.registerSystem('SystemB', ['ComponentB'], (entities) => {
            for (const entity of entities) {
                world.removeComponent(entity, 'ComponentB');
            }
        });

        for (let i = 0; i < 1000; i++) {
            const entity = world.createEntity();
            world.addComponent(entity, 'ComponentA');
        }
    },
    measure() {
        world.tick(0);
    },
    afterAll() {
        world.unregisterSystem('SystemA');
        world.unregisterSystem('SystemB');
        world.unregisterComponent('ComponentA');
        world.unregisterComponent('ComponentB');
        world.destroyAllEntities();
        world.tick(0);
    },
};
