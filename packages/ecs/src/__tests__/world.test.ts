import { world } from '../index';
import { ComponentManager, EntityManager, SystemManager } from '../managers';
import { type Position, positionSystem, positionSystemQuery, type Size } from './utils';

describe('World', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const offDestroyEntity = jest.spyOn(EntityManager, 'offDestroyEntity');
  const offAddComponent = jest.spyOn(ComponentManager, 'offAddComponent');
  const offRemoveComponent = jest.spyOn(ComponentManager, 'offRemoveComponent');

  const onDestroyEntityListener = jest.fn();

  beforeAll(() => {
    EntityManager.onDestroyEntity(onDestroyEntityListener);

    world.registerSystem('Position', positionSystemQuery, positionSystem);
    world.registerComponent<Position>('Position', { x: 0, y: 0 });
    world.registerComponent<Size>('Size', { w: 0, h: 0 });

    {
      const entity = world.createEntity();
      world.addComponent<Position>(entity, 'Position');
      world.addComponent<Size>(entity, 'Size');
    }

    {
      const entity = world.createEntity();
      world.addComponent<Position>(entity, 'Position');
    }

    {
      const entity = world.createEntity();
      world.addComponent<Size>(entity, 'Size');
    }

    {
      const entity = world.createEntity();
      world.addComponent<Position>(entity, 'Position');
      world.addComponent<Size>(entity, 'Size');
    }
  });

  test('.tick(DeltaTime)', () => {
    world.tick(0.016);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    positionSystem.shouldThrow = true;
    world.tick(0.016);

    expect(error).toHaveBeenLastCalledWith(new Error('system error'));

    expect(Array.from(SystemManager.getSystemEntities('Position'))).toEqual(
      expect.arrayContaining([0, 3]),
    );
    expect(positionSystem).toBeCalledTimes(2);
    expect(positionSystem).toHaveBeenNthCalledWith(1, [0, 3], 0.016);
    expect(positionSystem).toHaveBeenNthCalledWith(2, [0, 3], 0.016);
  });

  test('.unregisterSystem(System)', () => {
    world.unregisterSystem('Position');

    world.tick(0.016);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    expect(offDestroyEntity).toBeCalledTimes(1);
    expect(offAddComponent).toBeCalledTimes(1);
    expect(offRemoveComponent).toBeCalledTimes(1);
  });

  test('.unregisterComponent(Component)', () => {
    world.unregisterComponent('Position');
    world.unregisterComponent('Size');

    world.tick(0.016);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    expect(offDestroyEntity).toBeCalledTimes(2);
  });

  test('.destroyEntity(Entity)', () => {
    world.destroyEntity(0);
    world.tick(0.016);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    expect(onDestroyEntityListener).toBeCalledTimes(1);
  });

  test('.destroyAllEntities()', () => {
    world.destroyAllEntities();
    world.tick(0.016);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    expect(onDestroyEntityListener).toBeCalledTimes(3);
  });
});
