import { onDestroyEntity, offDestroyEntity } from './entity.manager';
import type { Component, ComponentListener, ComponentType, Entity, EntityListener } from '../types';

interface ComponentManagerState {
  types: Map<ComponentType, Record<string, unknown>>;
  instances: Record<ComponentType, Record<Entity, Component>>;
  onAddListeners: ComponentListener[];
  onRemoveListeners: ComponentListener[];
  entityListeners: Map<ComponentType, EntityListener>;
}

const state: ComponentManagerState = {
  types: new Map(),
  instances: {},
  onAddListeners: [],
  onRemoveListeners: [],
  entityListeners: new Map(),
};

export function registerComponent<T extends Component>(
  name: string,
  defaultValue: Omit<T, 'type'>,
): void {
  const type = makeType(name);

  if (state.types.has(type)) {
    console.error(`Component (${name}) already registered`);

    return;
  }

  state.types.set(type, defaultValue);
  state.instances[type] = {};

  const listener = (entity: Entity): void => {
    removeComponent(entity, name);
  };

  state.entityListeners.set(type, listener);

  onDestroyEntity(listener);
}

export function unregisterComponent(name: string): void {
  const type = makeType(name);

  if (!state.types.has(type)) {
    console.error(`Component (${name}) not registered`);

    return;
  }

  const listener = state.entityListeners.get(type) as EntityListener;
  offDestroyEntity(listener);

  state.types.delete(type);

  const instance = state.instances[type];

  if (instance !== undefined) {
    delete state.instances[type];

    const entities = Object.keys(instance).map((entity) => parseInt(entity, 10));

    for (const entity of entities) {
      onRemoveListeners(entity);
    }
  }
}

export function addComponent<T extends Component>(
  entity: Entity,
  name: string,
  value: Partial<Omit<T, 'type'>> = {},
): void {
  const type = makeType(name);
  const instance = state.instances[type];

  if (instance === undefined) {
    console.error(`Component (${name}) not registered`);

    return;
  }

  instance[entity] = Object.seal({
    type,
    ...state.types.get(type),
    ...value,
  });

  onAddListeners(entity);
}

export function getComponent<T extends Component>(entity: Entity, name: string): T | undefined {
  const type = makeType(name);
  const instance = state.instances[type];

  if (instance === undefined) {
    console.error(`Component (${name}) not registered`);

    return;
  }

  return instance[entity] as T;
}

export function getComponents<T extends Component[]>(
  entity: Entity,
  names: string[],
): Array<T | undefined> {
  return names.map((name) => getComponent(entity, name) as T | undefined);
}

export function hasComponent(entity: Entity, name: string): boolean {
  const type = makeType(name);
  const instance = state.instances[type];

  if (instance === undefined) {
    console.error(`Component (${name}) not registered`);

    return false;
  }

  return instance[entity] !== undefined;
}

export function hasComponents(entity: Entity, names: string[]): boolean {
  return names.every((name) => hasComponent(entity, name));
}

export function removeComponent(entity: Entity, name: string): void {
  const type = makeType(name);
  const instance = state.instances[type];

  if (instance === undefined) {
    console.error(`Component (${name}) not registered`);

    return;
  }

  delete instance[entity];

  onRemoveListeners(entity);
}

function onAddListeners(entity: Entity): void {
  for (const listener of state.onAddListeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

function onRemoveListeners(entity: Entity): void {
  for (const listener of state.onRemoveListeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

export function onAddComponent(fn: ComponentListener): void {
  state.onAddListeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (state.onAddListeners.length > 10) {
      console.warn('onAddComponent: exceeded the limit of 10 listeners');
    }
  }
}

export function offAddComponent(fn: ComponentListener): void {
  const index = state.onAddListeners.findIndex((listener) => fn === listener);

  if (index > -1) {
    state.onAddListeners.splice(index, 1);
  }
}

export function onRemoveComponent(fn: ComponentListener): void {
  state.onRemoveListeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (state.onRemoveListeners.length > 10) {
      console.warn('onRemoveComponent: exceeded the limit of 10 listeners');
    }
  }
}

export function offRemoveComponent(fn: ComponentListener): void {
  const index = state.onRemoveListeners.findIndex((listener) => fn === listener);

  if (index > -1) {
    state.onRemoveListeners.splice(index, 1);
  }
}

function makeType(name: string): ComponentType {
  return `Component::${name}`;
}
