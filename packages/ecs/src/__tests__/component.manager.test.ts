import { EntityManager, ComponentManager } from '../managers';
import { type Entity } from '../types';
import { type Position, type Size, type Renderable, type Texture } from './utils';

describe('ComponentManager', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const onDestroyEntity = jest.spyOn(EntityManager, 'onDestroyEntity');

  const entity = EntityManager.createEntity();
  const entity2 = EntityManager.createEntity();

  const onAddComponentListener = jest.fn((value: Entity) => {
    if (value === entity2) throw new Error('listener error');
  });
  const onRemoveComponentListener = jest.fn((value: Entity) => {
    if (value === entity2) throw new Error('listener error');
  });
  const onDestroyEntityListener = jest.fn((value: Entity) => {
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

  beforeAll(() => {
    EntityManager.onDestroyEntity(onDestroyEntityListener);
    ComponentManager.onAddComponent(onAddComponentListener);
    ComponentManager.onRemoveComponent(onRemoveComponentListener);
  });

  afterAll(() => {
    EntityManager.offDestroyEntity(onDestroyEntityListener);
    ComponentManager.offAddComponent(onAddComponentListener);
    ComponentManager.offRemoveComponent(onRemoveComponentListener);
  });

  test('.registerComponent(String, DefaultValue)', () => {
    ComponentManager.registerComponent<Position>('Position', { x: 0, y: 0 });
    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });
    ComponentManager.registerComponent<Texture>('Texture', { color: '#FFFFFF' });

    expect(error).not.toBeCalled();
    expect(warn).not.toBeCalled();

    ComponentManager.registerComponent<Size>('Size', { w: 0, h: 0 });

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('Component (Size) already registered');

    expect(onDestroyEntity).toBeCalledTimes(3);
  });

  test('.addComponent(Entity, Component, Value?)', () => {
    ComponentManager.addComponent<Position>(entity, 'Position');
    ComponentManager.addComponent<Size>(entity, 'Size');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.addComponent<Renderable>(entity, 'Renderable');
    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith('Component (Renderable) not registered');

    // Force an exception on listener
    ComponentManager.addComponent<Position>(entity2, 'Position');
    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(new Error('listener error'));

    expect(onAddComponentListener).toBeCalledTimes(3);
    expect(onAddComponentListener).toHaveBeenNthCalledWith(1, entity);
    expect(onAddComponentListener).toHaveBeenNthCalledWith(2, entity);
    expect(onAddComponentListener).toHaveBeenNthCalledWith(3, entity2);
  });

  test('.getComponent(Entity, Component)', () => {
    expect(ComponentManager.getComponent(entity, 'Position')).toEqual(
      expect.objectContaining({ x: 0, y: 0 }),
    );
    expect(ComponentManager.getComponent(entity, 'Size')).toEqual(
      expect.objectContaining({ w: 0, h: 0 }),
    );
    expect(error).not.toBeCalled();

    ComponentManager.getComponent(entity, 'Renderable');
    expect(error).toBeCalledWith('Component (Renderable) not registered');
  });

  test('.getComponents(Entity, Component)', () => {
    expect(ComponentManager.getComponents(entity, ['Position', 'Size'])).toEqual(
      expect.arrayContaining([
        { type: 'Component::Position', x: 0, y: 0 },
        { type: 'Component::Size', w: 0, h: 0 },
      ]),
    );
    expect(ComponentManager.getComponents(entity, ['Position', 'Size', 'Texture'])).toEqual(
      expect.arrayContaining([
        { type: 'Component::Position', x: 0, y: 0 },
        { type: 'Component::Size', w: 0, h: 0 },
        undefined,
      ]),
    );

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.getComponents(entity, ['Position', 'Size', 'Renderable']);

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('Component (Renderable) not registered');
  });

  test('.hasComponent(Entity, Component)', () => {
    expect(ComponentManager.hasComponent(entity, 'Position')).toEqual(true);
    expect(ComponentManager.hasComponent(entity, 'Texture')).toEqual(false);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.hasComponent(entity, 'Renderable');

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('Component (Renderable) not registered');
  });

  test('.hasComponents(Entity, Component[])', () => {
    expect(ComponentManager.hasComponents(entity, ['Position', 'Size'])).toEqual(true);
    expect(ComponentManager.hasComponents(entity, ['Position', 'Size', 'Texture'])).toEqual(false);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.hasComponents(entity, ['Position', 'Size', 'Renderable']);

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('Component (Renderable) not registered');
  });

  test('.removeComponent(Entity, Component)', () => {
    ComponentManager.removeComponent(entity, 'Position');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.removeComponent(entity, 'Renderable');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith('Component (Renderable) not registered');

    // Force an exception on listener
    ComponentManager.removeComponent(entity2, 'Position');

    expect(warn).not.toBeCalled();
    expect(error).toHaveBeenLastCalledWith(new Error('listener error'));

    expect(onRemoveComponentListener).toBeCalledTimes(2);
    expect(onRemoveComponentListener).toHaveBeenNthCalledWith(1, entity);
    expect(onRemoveComponentListener).toHaveBeenNthCalledWith(2, entity2);
  });

  test('detach component when an entity is destroyed', () => {
    EntityManager.destroyEntity(entity);

    expect(ComponentManager.getComponent(entity, 'Size')).toBeUndefined();
    expect(ComponentManager.getComponents(entity, ['Size'])).toEqual(
      expect.arrayContaining([undefined]),
    );
    expect(ComponentManager.hasComponent(entity, 'Size')).toEqual(false);
  });

  test('.unregisterComponent(String)', () => {
    const tmpEntity = EntityManager.createEntity();
    ComponentManager.addComponent<Position>(tmpEntity, 'Position');
    ComponentManager.addComponent<Size>(tmpEntity, 'Size');

    ComponentManager.unregisterComponent('Position');
    ComponentManager.unregisterComponent('Size');
    ComponentManager.unregisterComponent('Texture');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    ComponentManager.unregisterComponent('Size');

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('Component (Size) not registered');

    expect(onRemoveComponentListener).toBeCalledTimes(2);
    expect(onRemoveComponentListener).toHaveBeenNthCalledWith(1, tmpEntity);
    expect(onRemoveComponentListener).toHaveBeenNthCalledWith(2, tmpEntity);
  });

  test('.onAddComponent(Function)', () => {
    for (const listener of listeners) {
      ComponentManager.onAddComponent(listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onAddComponent: exceeded the limit of 10 listeners');
    expect(error).not.toBeCalled();

    for (const listener of listeners) {
      ComponentManager.offAddComponent(listener);
    }
  });

  test('.onRemoveComponent(Function)', () => {
    for (const listener of listeners) {
      ComponentManager.onRemoveComponent(listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onRemoveComponent: exceeded the limit of 10 listeners');
    expect(error).not.toBeCalled();

    for (const listener of listeners) {
      ComponentManager.offRemoveComponent(listener);
    }
  });
});
