import * as EntityManager from '../managers/entity.manager';
import type { Entity } from '../types';

describe('EntityManager', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  const onCreateEntityListener = jest.fn((value: Entity) => {
    if (value === 1) {
      throw new Error('listener error');
    }
  });
  const onDestroyEntityListener = jest.fn((value: Entity) => {
    if (value === 1) {
      throw new Error('listener error');
    }
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
    EntityManager.onCreateEntity(onCreateEntityListener);
    EntityManager.onDestroyEntity(onDestroyEntityListener);
  });

  afterAll(() => {
    EntityManager.offCreateEntity(onCreateEntityListener);
    EntityManager.offDestroyEntity(onDestroyEntityListener);
  });

  test('.createEntity()', () => {
    const entity = EntityManager.createEntity();
    expect(entity).toEqual(0);
    expect(error).not.toBeCalled();

    const entity1 = EntityManager.createEntity();
    expect(entity1).toEqual(1);
    expect(error).toBeCalledWith(new Error('listener error'));
    error.mockClear();

    const entity2 = EntityManager.createEntity();
    expect(entity2).toEqual(2);
    expect(error).not.toBeCalled();

    expect(onCreateEntityListener).toBeCalledTimes(3);
    expect(onCreateEntityListener).toHaveBeenNthCalledWith(1, entity);
    expect(onCreateEntityListener).toHaveBeenNthCalledWith(2, entity1);
    expect(onCreateEntityListener).toHaveBeenNthCalledWith(3, entity2);
  });

  test('.destroyEntity(Entity)', () => {
    EntityManager.destroyEntity(0);
    expect(error).not.toBeCalled();

    EntityManager.destroyEntity(1);
    expect(error).toBeCalledWith(new Error('listener error'));
    error.mockClear();

    EntityManager.destroyEntity(2);
    expect(error).not.toBeCalled();

    expect(onDestroyEntityListener).toBeCalledTimes(3);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(1, 0);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(2, 1);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(3, 2);
  });

  test('.onCreateEntity(Function)', () => {
    for (const listener of listeners) {
      EntityManager.onCreateEntity(listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onCreateListeners: exceeded the limit of 10 listeners');

    for (const listener of listeners) {
      EntityManager.offCreateEntity(listener);
    }
  });

  test('.destroyAllEntities()', () => {
    const entity1 = EntityManager.createEntity();
    const entity2 = EntityManager.createEntity();
    const entity3 = EntityManager.createEntity();

    EntityManager.destroyAllEntities();
    expect(error).not.toBeCalled();

    expect(onDestroyEntityListener).toBeCalledTimes(3);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(1, entity1);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(2, entity2);
    expect(onDestroyEntityListener).toHaveBeenNthCalledWith(3, entity3);
  });

  test('.onDestroyEntity(Function)', () => {
    for (const listener of listeners) {
      EntityManager.onDestroyEntity(listener);
    }

    expect(warn).toHaveBeenLastCalledWith('onDestroyListeners: exceeded the limit of 10 listeners');

    for (const listener of listeners) {
      EntityManager.offDestroyEntity(listener);
    }
  });
});
