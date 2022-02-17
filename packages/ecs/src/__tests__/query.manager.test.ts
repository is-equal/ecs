import * as EntityManager from '../managers/entity.manager';
import * as QueryManager from '../managers/query.manager';
import * as ComponentManager from '../managers/component.manager';
import { exclude } from '../types';

describe('QueryManager', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const onAddedComponent = jest.spyOn(ComponentManager, 'onAddedComponent');
  const onRemovedComponent = jest.spyOn(ComponentManager, 'onRemovedComponent');
  const offAddedComponent = jest.spyOn(ComponentManager, 'offAddedComponent');
  const offRemovedComponent = jest.spyOn(ComponentManager, 'offRemovedComponent');

  beforeAll(() => {
    ComponentManager.registerComponent('Position', { x: 0, y: 0 });
    ComponentManager.registerComponent('Size', { w: 0, h: 0 });
  });

  afterAll(() => {
    ComponentManager.unregisterComponent('Position');
    ComponentManager.unregisterComponent('Size');
    EntityManager.destroyAllEntities();
  });

  test('.registerQuery(SystemType, Query)', () => {
    QueryManager.registerQuery('Movement', ['Position', exclude('Size')]);

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    QueryManager.registerQuery('Movement', ['Position', 'Size']);
    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('registerQuery: Query for System (Movement) already registered');

    expect(onAddedComponent).toBeCalledTimes(2);
    expect(onRemovedComponent).toBeCalledTimes(2);
  });

  test('.executeQueryFrom(SystemType)', () => {
    const entity = EntityManager.createEntity();

    expect(QueryManager.executeQueryFrom('Movement').size).toEqual(0);

    ComponentManager.addComponent(entity, 'Position');

    expect(QueryManager.executeQueryFrom('Movement').size).toEqual(1);

    ComponentManager.addComponent(entity, 'Size');

    expect(QueryManager.executeQueryFrom('Movement').size).toEqual(0);
  });

  test('.unregisterQuery(SystemType)', () => {
    QueryManager.unregisterQuery('Movement');

    expect(warn).not.toBeCalled();
    expect(error).not.toBeCalled();

    QueryManager.unregisterQuery('Movement');

    expect(warn).not.toBeCalled();
    expect(error).toBeCalledWith('unregisterQuery: Query for System (Movement) not found');

    expect(offAddedComponent).toBeCalledTimes(2);
    expect(offRemovedComponent).toBeCalledTimes(2);
  });
});
