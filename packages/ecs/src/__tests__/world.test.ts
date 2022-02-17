import { world } from '../';
import { QueryManager } from '../managers';
import { type Position, positionSystem, positionSystemQuery, type Size } from './utils';

describe('World', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  beforeAll(() => {
    world.registerComponent<Position>('Position', { x: 0, y: 0 });
    world.registerComponent<Size>('Size', { w: 0, h: 0 });
    world.registerSystem('Position', positionSystemQuery, positionSystem);

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

  afterAll(() => {
    world.unregisterSystem('Position');
    world.unregisterComponent('Position');
    world.unregisterComponent('Size');
    world.destroyAllEntities();
  });

  test('.tick(DeltaTime)', () => {
    world.tick(0.016);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    positionSystem.shouldThrow = true;
    world.tick(0.016);
    positionSystem.shouldThrow = false;

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(new Error('system error'));

    const entities = new Set([0, 3]);
    expect(QueryManager.executeQueryFrom('Position')).toEqual(entities);
    expect(positionSystem).toBeCalledTimes(2);
    expect(positionSystem).toHaveBeenNthCalledWith(1, entities, 0.016);
    expect(positionSystem).toHaveBeenNthCalledWith(2, entities, 0.016);
  });
});
