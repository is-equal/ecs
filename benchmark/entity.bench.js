/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { world } from '@equal/ecs';

export function init(benchmarks) {
  benchmarks
    .add({
      name: 'world.destroyAllEntities() without System and Component',
      before() {
        for (let i = 0; i < 1024; i++) {
          world.createEntity();
        }
      },
      execute() {
        world.destroyAllEntities();
        world.tick(0);
      },
    })
    .add({
      name: 'world.destroyAllEntities() with System and Component',
      beforeAll() {
        world.registerComponent('ComponentA', { x: 0, y: 0 });
        world.registerSystem('SystemA', ['ComponentA'], () => {
          // noop
        });
      },
      before() {
        for (let i = 0; i < 1024; i++) {
          const entity = world.createEntity();
          world.addComponent(entity, 'ComponentA');
        }
      },
      execute() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll() {
        world.unregisterComponent('ComponentA');
        world.unregisterSystem('SystemA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.destroyAllEntities() with N Systems and Component',
      beforeAll(ctx) {
        world.registerComponent('ComponentA', { x: 0, y: 0 });

        ctx.systems = [];

        for (let i = 0; i < 10; i++) {
          const name = 'System' + i;
          ctx.systems.push(name);
          world.registerSystem(name, ['ComponentA'], () => {
            // noop
          });
        }
      },
      before() {
        for (let i = 0; i < 1024; i++) {
          const entity = world.createEntity();
          world.addComponent(entity, 'ComponentA');
        }
      },
      execute() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll(ctx) {
        for (const system of ctx.systems) {
          world.unregisterSystem(system);
        }
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.addComponent(Entity, Component) without System',
      beforeAll() {
        world.registerComponent('ComponentA', { x: 0, y: 0 });
      },
      before(ctx) {
        ctx.entity = world.createEntity();
      },
      execute(ctx) {
        world.addComponent(ctx.entity, 'ComponentA');
      },
      after() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll() {
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.addComponent(Entity, Component) with System',
      beforeAll() {
        world.registerComponent('ComponentA', { x: 0, y: 0 });
        world.registerSystem('SystemA', ['ComponentA'], () => {
          // noop
        });
      },
      before(ctx) {
        ctx.entity = world.createEntity();
      },
      execute(ctx) {
        world.addComponent(ctx.entity, 'ComponentA');
      },
      after() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll() {
        world.unregisterSystem('SystemA');
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.destroyEntity(Entity) with Component and System',
      beforeAll() {
        world.registerComponent('ComponentA', { x: 0, y: 0 });
        world.registerSystem('SystemA', ['ComponentA'], () => {
          // noop
        });
      },
      before(ctx) {
        ctx.entity = world.createEntity();
        world.addComponent(ctx.entity, 'ComponentA');
      },
      execute(ctx) {
        world.destroyEntity(ctx.entity);
        world.tick(0);
      },
      afterAll() {
        world.unregisterSystem('SystemA');
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.addComponent(Entity, Component) with N Systems',
      beforeAll(ctx) {
        world.registerComponent('ComponentA', { x: 0, y: 0 });

        ctx.systems = [];

        for (let i = 0; i < 10; i++) {
          const name = 'System' + i;
          ctx.systems.push(name);
          world.registerSystem(name, ['ComponentA'], () => {
            // noop
          });
        }
      },
      before(ctx) {
        ctx.entity = world.createEntity();
      },
      execute(ctx) {
        world.addComponent(ctx.entity, 'ComponentA');
      },
      after() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll(ctx) {
        for (const system of ctx.systems) {
          world.unregisterSystem(system);
        }
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    })
    .add({
      name: 'world.removeComponent(Entity, Component) with N Systems',
      beforeAll(ctx) {
        world.registerComponent('ComponentA', { x: 0, y: 0 });

        ctx.systems = [];

        for (let i = 0; i < 10; i++) {
          const name = 'System' + i;
          ctx.systems.push(name);
          world.registerSystem(name, ['ComponentA'], () => {
            // noop
          });
        }
      },
      before(ctx) {
        ctx.entity = world.createEntity();
        world.addComponent(ctx.entity, 'ComponentA');
      },
      execute(ctx) {
        world.removeComponent(ctx.entity, 'ComponentA');
      },
      after() {
        world.destroyAllEntities();
        world.tick(0);
      },
      afterAll(ctx) {
        for (const system of ctx.systems) {
          world.unregisterSystem(system);
        }
        world.unregisterComponent('ComponentA');
        world.tick(0);
      },
    });
}
