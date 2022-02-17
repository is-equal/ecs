import * as EntityManager from '../managers/entity.manager';
import * as ComponentManager from '../managers/component.manager';

describe('EntityManager', () => {
  const removeAllComponents = jest.spyOn(ComponentManager, 'removeAllComponents');
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  test('.createEntity()', () => {
    const entity = EntityManager.createEntity();
    expect(entity).toEqual(0);

    const entity1 = EntityManager.createEntity();
    expect(entity1).toEqual(1);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();
  });

  test('.destroyEntity(Entity)', () => {
    EntityManager.destroyEntity(0);
    EntityManager.destroyEntity(2);

    expect(removeAllComponents).toBeCalledTimes(2);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();
  });
});
