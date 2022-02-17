import { EntityManager, ComponentManager } from '../managers';
import { type Entity } from '../types';
import { type Position, type Size, type Renderable, type Texture } from './utils';

describe('ComponentManager', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  const entity = EntityManager.createEntity();
  const entity2 = EntityManager.createEntity();

  const onAddedComponentListener = jest.fn((value: Entity) => {
    if (value === entity2) throw new Error('listener error');
  });
  const onRemovedComponentListener = jest.fn((value: Entity) => {
    if (value === entity2) throw new Error('listener error');
  });

  const listeners = [
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
  ];

  test('.registerComponent(String, DefaultValue)', () => {
    ComponentManager.registerComponent<Position>('Position', { x: 0, y: 0 });
    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });
    ComponentManager.registerComponent<Texture>('Texture', { color: '#FFFFFF' });

    ComponentManager.onAddedComponent('Position', onAddedComponentListener);
    ComponentManager.onRemovedComponent('Position', onRemovedComponentListener);
    ComponentManager.onAddedComponent('Size', onAddedComponentListener);
    ComponentManager.onRemovedComponent('Size', onRemovedComponentListener);

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('registerComponent: Component (Size) already registered');
  });

  test('.addComponent(Entity, ComponentType, Value?)', () => {
    ComponentManager.addComponent<Position>(entity, 'Position');
    ComponentManager.addComponent<Size>(entity, 'Size');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.addComponent<Size>(entity, 'Size');

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('addComponent: Component (Size) already added');

    ComponentManager.addComponent<Renderable>(entity, 'Renderable');
    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith('addComponent: Component (Renderable) not registered');

    // Force an exception on listener
    ComponentManager.addComponent<Position>(entity2, 'Position');
    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(new Error('listener error'));

    expect(onAddedComponentListener).toBeCalledTimes(3);
    expect(onAddedComponentListener).toHaveBeenNthCalledWith(1, entity);
    expect(onAddedComponentListener).toHaveBeenNthCalledWith(2, entity);
    expect(onAddedComponentListener).toHaveBeenNthCalledWith(3, entity2);
  });

  test('.getComponent(Entity, ComponentType)', () => {
    expect(ComponentManager.getComponent(entity, 'Position')).toEqual(
      expect.objectContaining({ x: 0, y: 0 }),
    );
    expect(ComponentManager.getComponent(entity, 'Size')).toEqual(
      expect.objectContaining({ w: 0, h: 0 }),
    );
    expect(error).not.toBeCalled();
    expect(ComponentManager.getComponent(entity, 'Renderable')).toBeUndefined();
  });

  test('.getComponents(Entity, ComponentType)', () => {
    expect(ComponentManager.getComponents(entity, ['Position', 'Size'])).toEqual(
      expect.arrayContaining([
        { type: 'Position', x: 0, y: 0 },
        { type: 'Size', w: 0, h: 0 },
      ]),
    );
    expect(ComponentManager.getComponents(entity, ['Position', 'Size', 'Texture'])).toEqual(
      expect.arrayContaining([
        { type: 'Position', x: 0, y: 0 },
        { type: 'Size', w: 0, h: 0 },
        undefined,
      ]),
    );

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    expect(ComponentManager.getComponents(entity, ['Position', 'Size', 'Renderable'])).toEqual(
      expect.arrayContaining([
        { type: 'Position', x: 0, y: 0 },
        { type: 'Size', w: 0, h: 0 },
        undefined,
      ]),
    );

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();
  });

  test('.hasComponent(Entity, ComponentType)', () => {
    expect(ComponentManager.hasComponent(entity, 'Position')).toEqual(true);
    expect(ComponentManager.hasComponent(entity, 'Texture')).toEqual(false);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    expect(ComponentManager.hasComponent(entity, 'Renderable')).toEqual(false);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();
  });

  test('.hasComponents(Entity, ComponentType[])', () => {
    expect(ComponentManager.hasComponents(entity, ['Position', 'Size'])).toEqual(true);
    expect(ComponentManager.hasComponents(entity, ['Position', 'Size', 'Texture'])).toEqual(false);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    expect(ComponentManager.hasComponents(entity, ['Position', 'Size', 'Renderable'])).toEqual(
      false,
    );

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();
  });

  test('.removeAllComponents(Entity)', () => {
    const entity = EntityManager.createEntity();
    ComponentManager.removeAllComponents(entity);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    EntityManager.destroyEntity(entity);
  });

  test('.removeComponent(Entity, ComponentType)', () => {
    ComponentManager.removeComponent(entity, 'Position');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.removeComponent(entity, 'Position');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(
      'removeComponent: Component (Position) was not added to Entity (0)',
    );

    ComponentManager.removeComponent(entity, 'Renderable');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(
      'removeComponent: Component (Renderable) not registered',
    );

    ComponentManager.removeComponent(entity2, 'Position');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(new Error('listener error'));

    expect(onRemovedComponentListener).toBeCalledTimes(2);
    expect(onRemovedComponentListener).toHaveBeenNthCalledWith(1, entity);
    expect(onRemovedComponentListener).toHaveBeenNthCalledWith(2, entity2);
  });

  test('detach component when an entity is destroyed', () => {
    EntityManager.destroyEntity(entity);

    expect(ComponentManager.getComponent(entity, 'Size')).toBeUndefined();
    expect(ComponentManager.getComponents(entity, ['Size'])).toEqual(
      expect.arrayContaining([undefined]),
    );
    expect(ComponentManager.hasComponent(entity, 'Size')).toEqual(false);
  });

  test('.onAddedComponent(ComponentType, Function)', () => {
    ComponentManager.onAddedComponent('Renderer', jest.fn());

    expect(error).toHaveBeenLastCalledWith('onAddedComponent: Component (Renderer) not registered');

    ComponentManager.offAddedComponent('Renderer', jest.fn());

    expect(error).toHaveBeenLastCalledWith(
      'offAddedComponent: Component (Renderer) not registered',
    );

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledTimes(2);
    error.mockClear();

    for (const listener of listeners) {
      ComponentManager.onAddedComponent('Position', listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onAddedComponent: exceeded the limit of 10 listeners');
    expect(error).not.toBeCalled();

    for (const listener of listeners) {
      ComponentManager.offAddedComponent('Position', listener);
    }
  });

  test('.onRemovedComponent(ComponentType, Function)', () => {
    ComponentManager.onRemovedComponent('Renderer', jest.fn());

    expect(error).toHaveBeenLastCalledWith(
      'onRemovedComponent: Component (Renderer) not registered',
    );

    ComponentManager.offRemovedComponent('Renderer', jest.fn());

    expect(error).toHaveBeenLastCalledWith(
      'offRemovedComponent: Component (Renderer) not registered',
    );

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledTimes(2);
    error.mockClear();

    for (const listener of listeners) {
      ComponentManager.onRemovedComponent('Position', listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onRemovedComponent: exceeded the limit of 10 listeners');
    expect(error).not.toBeCalled();

    for (const listener of listeners) {
      ComponentManager.offRemovedComponent('Position', listener);
    }
  });

  test('.unregisterComponent(ComponentType)', () => {
    const tmpEntity = EntityManager.createEntity();
    ComponentManager.addComponent<Position>(tmpEntity, 'Position');
    ComponentManager.addComponent<Size>(tmpEntity, 'Size');

    ComponentManager.unregisterComponent('Position');
    ComponentManager.unregisterComponent('Size');
    ComponentManager.unregisterComponent('Texture');

    expect(error).not.toBeCalled();

    ComponentManager.unregisterComponent('Size');

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('unregisterComponent: Component (Size) not registered');

    expect(onRemovedComponentListener).toBeCalledTimes(2);
    expect(onRemovedComponentListener).toHaveBeenNthCalledWith(1, tmpEntity);
    expect(onRemovedComponentListener).toHaveBeenNthCalledWith(2, tmpEntity);
  });
});
