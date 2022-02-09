import * as ComponentManager from '../managers/component.manager';
import * as EntityManager from '../managers/entity.manager';
import * as SystemManager from '../managers/system.manager';
import { type Position, positionSystem, positionSystemQuery, type Size } from './utils';
import type { Entity } from '../types';

describe('SystemManager', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const onAddComponent = jest.spyOn(ComponentManager, 'onAddComponent');
  const onRemoveComponent = jest.spyOn(ComponentManager, 'onRemoveComponent');
  const offAddComponent = jest.spyOn(ComponentManager, 'offAddComponent');
  const offRemoveComponent = jest.spyOn(ComponentManager, 'offRemoveComponent');

  const entity: Entity = EntityManager.createEntity();
  const entity2: Entity = EntityManager.createEntity();

  beforeAll(() => {
    ComponentManager.registerComponent<Position>('Position', { x: 0, y: 0 });
    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });
  });

  test('.registerSystem(System)', () => {
    SystemManager.registerSystem('Position', positionSystemQuery, positionSystem);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    SystemManager.registerSystem('Position', positionSystemQuery, positionSystem);

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('System (Position) already registered');

    expect(onAddComponent).toBeCalledTimes(1);
    expect(onRemoveComponent).toBeCalledTimes(1);
  });

  test('update entities when an entity have the requirements', () => {
    ComponentManager.addComponent(entity, 'Position');
    ComponentManager.addComponent(entity, 'Size');

    ComponentManager.addComponent(entity2, 'Position');
    ComponentManager.addComponent(entity2, 'Size');

    expect(SystemManager.getSystemEntities('Position')).toHaveLength(2);
  });

  test('update entities when an entity is destroyed', () => {
    EntityManager.destroyEntity(entity);

    expect(SystemManager.getSystemEntities('Position')).toHaveLength(1);
  });

  test('should not execute if has no entities', () => {
    EntityManager.destroyEntity(entity2);

    expect(SystemManager.getSystemEntities('Position')).toHaveLength(0);

    const systems = SystemManager.getSystems();

    for (const system of systems) {
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
    expect(error).toHaveBeenLastCalledWith('System (Position) not registered');

    expect(SystemManager.getSystemEntities('Position')).toHaveLength(0);
    expect(offAddComponent).toBeCalledTimes(1);
    expect(offRemoveComponent).toBeCalledTimes(1);
  });
});
