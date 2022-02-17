/* eslint-disable */
const {world}  = require('@equal/ecs');

module.exports = {
  name: 'Packed 5',
  beforeAll() {
    world.registerComponent('ComponentA', { value: 0 });
    world.registerComponent('ComponentB', { value: 0 });
    world.registerComponent('ComponentC', { value: 0 });
    world.registerComponent('ComponentD', { value: 0 });
    world.registerComponent('ComponentE', { value: 0 });

    world.registerSystem('SystemA', ['ComponentA'], (entities) => {
      for (const entity of entities) {
        const component = world.getComponent(entity, 'ComponentA');
        component.value *= 2;
      }
    });

    world.registerSystem('SystemB', ['ComponentB'], (entities) => {
      for (const entity of entities) {
        const component = world.getComponent(entity, 'ComponentB');
        component.value *= 2;
      }
    });

    world.registerSystem('SystemC', ['ComponentC'], (entities) => {
      for (const entity of entities) {
        const component = world.getComponent(entity, 'ComponentC');
        component.value *= 2;
      }
    });

    world.registerSystem('SystemD', ['ComponentD'], (entities) => {
      for (const entity of entities) {
        const component = world.getComponent(entity, 'ComponentD');
        component.value *= 2;
      }
    });

    world.registerSystem('SystemE', ['ComponentE'], (entities) => {
      for (const entity of entities) {
        const component = world.getComponent(entity, 'ComponentE');
        component.value *= 2;
      }
    });

    for (let i = 0; i < 1000; i++) {
      const entity = world.createEntity();
      world.addComponent(entity, 'ComponentA');
      world.addComponent(entity, 'ComponentB');
      world.addComponent(entity, 'ComponentC');
      world.addComponent(entity, 'ComponentD');
      world.addComponent(entity, 'ComponentE');
    }
  },
  measure() {
    world.tick(0);
  },
  afterAll() {
    world.unregisterSystem('SystemA');
    world.unregisterSystem('SystemB');
    world.unregisterSystem('SystemC');
    world.unregisterSystem('SystemD');
    world.unregisterSystem('SystemE');
    world.unregisterComponent('ComponentA');
    world.unregisterComponent('ComponentB');
    world.unregisterComponent('ComponentC');
    world.unregisterComponent('ComponentD');
    world.unregisterComponent('ComponentE');
    world.destroyAllEntities();
    world.tick(0);
  },
};
