import { ComponentManager, EntityManager, SystemManager, QueryManager } from '../managers';
import { type Position, positionSystem, positionSystemQuery, type Size } from './utils';
import type { Entity } from '../types';

describe('SystemManager', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const onAddedComponent = jest.spyOn(ComponentManager, 'onAddedComponent');
  const onRemovedComponent = jest.spyOn(ComponentManager, 'onRemovedComponent');
  const offAddedComponent = jest.spyOn(ComponentManager, 'offAddedComponent');
  const offRemovedComponent = jest.spyOn(ComponentManager, 'offRemovedComponent');

  const entity: Entity = EntityManager.createEntity();
  const entity2: Entity = EntityManager.createEntity();

  beforeAll(() => {
    ComponentManager.registerComponent<Position>('Position', { x: 0, y: 0 });
    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });
  });

  afterAll(() => {
    ComponentManager.unregisterComponent('Position');
    ComponentManager.unregisterComponent('Size');
    EntityManager.destroyAllEntities();
  });

  test('.registerSystem(System)', () => {
    SystemManager.registerSystem('Position', positionSystemQuery, positionSystem);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    SystemManager.registerSystem('Position', positionSystemQuery, positionSystem);

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('registerSystem: System (Position) already registered');

    expect(onAddedComponent).toBeCalledTimes(2);
    expect(onRemovedComponent).toBeCalledTimes(2);
  });

  test('update entities when an entity have the requirements', () => {
    ComponentManager.addComponent(entity, 'Position');
    ComponentManager.addComponent(entity, 'Size');

    ComponentManager.addComponent(entity2, 'Position');
    ComponentManager.addComponent(entity2, 'Size');

    expect(QueryManager.executeQueryFrom('Position').size).toEqual(2);
  });

  test('update entities when an entity is destroyed', () => {
    EntityManager.destroyEntity(entity);

    expect(QueryManager.executeQueryFrom('Position').size).toEqual(1);
  });

  test('should not execute if has no entities', () => {
    EntityManager.destroyEntity(entity2);

    expect(QueryManager.executeQueryFrom('Position').size).toEqual(0);

    for (const system of SystemManager.getSystems()) {
      system.update(0.016);
    }

    expect(positionSystem).not.toBeCalled();
  });

  test('.unregisterSystem(System)', () => {
    SystemManager.unregisterSystem('Position');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    SystemManager.unregisterSystem('Position');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith('unregisterSystem: System (Position) not registered');

    expect(offAddedComponent).toBeCalledTimes(2);
    expect(offRemovedComponent).toBeCalledTimes(2);
  });
});
