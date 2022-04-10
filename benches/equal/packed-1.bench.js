const { world } = require('@equal/ecs');

module.exports = {
  name: 'Packed 1',
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

    for (let i = 0; i < 5000; i++) {
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
    world.unregisterComponent('ComponentA');
    world.unregisterComponent('ComponentB');
    world.unregisterComponent('ComponentC');
    world.unregisterComponent('ComponentD');
    world.unregisterComponent('ComponentE');
    world.destroyAllEntities();
    world.tick(0);
  },
};
