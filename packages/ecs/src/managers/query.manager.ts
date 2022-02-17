import {
  type ComponentListener,
  type Entity,
  type Query,
  type SystemType,
  type QueryItem,
} from '../types';
import * as ComponentManager from './component.manager';

interface QueryManagerState {
  queries: Map<SystemType, Query>;
  entities: Map<SystemType, Set<Entity>>;
  needsUpdate: Map<SystemType, Set<Entity>>;
  componentListeners: Map<SystemType, ComponentListener>;
}

const state: QueryManagerState = {
  queries: new Map(),
  entities: new Map(),
  needsUpdate: new Map(),
  componentListeners: new Map(),
};

/**
 * @internal
 */
export function registerQuery(system: SystemType, query: Query): void {
  if (state.queries.has(system)) {
    console.error(`registerQuery: Query for System (${system}) already registered`);

    return;
  }

  state.queries.set(system, query);
  state.entities.set(system, new Set());

  const needsUpdate = new Set<Entity>();
  state.needsUpdate.set(system, needsUpdate);

  const componentListener = (entity: Entity): void => void needsUpdate.add(entity);

  for (const queryItem of query) {
    if (typeof queryItem === 'object') {
      ComponentManager.onAddedComponent(queryItem.component, componentListener);
      ComponentManager.onRemovedComponent(queryItem.component, componentListener);
    } else {
      ComponentManager.onAddedComponent(queryItem, componentListener);
      ComponentManager.onRemovedComponent(queryItem, componentListener);
    }
  }

  state.componentListeners.set(system, componentListener);
}

/**
 * @internal
 */
export function unregisterQuery(system: SystemType): void {
  const query = state.queries.get(system);

  if (query === undefined) {
    console.error(`unregisterQuery: Query for System (${system}) not found`);

    return;
  }

  const componentListener = state.componentListeners.get(system)!;

  for (const queryItem of query) {
    if (typeof queryItem === 'object') {
      ComponentManager.offAddedComponent(queryItem.component, componentListener);
      ComponentManager.offRemovedComponent(queryItem.component, componentListener);
    } else {
      ComponentManager.offAddedComponent(queryItem, componentListener);
      ComponentManager.offRemovedComponent(queryItem, componentListener);
    }
  }

  state.componentListeners.delete(system);

  state.queries.delete(system);
  state.entities.delete(system);
  state.needsUpdate.delete(system);
}

/**
 * @internal
 */
export function executeQueryFrom(system: SystemType): ReadonlySet<Entity> {
  const query = state.queries.get(system)!;
  const entities = state.entities.get(system)!;
  const entitiesToUpdate = state.needsUpdate.get(system)!;

  for (const entity of entitiesToUpdate) {
    if (queryComponents(entity, query)) {
      entities.add(entity);
    } else {
      entities.delete(entity);
    }
  }

  entitiesToUpdate.clear();

  return entities;
}

/**
 * @internal
 */
function queryComponents(entity: Entity, query: Query): boolean {
  return query.every((queryItem) => queryComponent(entity, queryItem));
}

/**
 * @internal
 */
function queryComponent(entity: Entity, queryItem: QueryItem): boolean {
  if (typeof queryItem === 'object') {
    const { component, operation } = queryItem;

    if (operation === 'exclude') {
      return !ComponentManager.hasComponent(entity, component);
    }

    return false;
  }

  return ComponentManager.hasComponent(entity, queryItem);
}
