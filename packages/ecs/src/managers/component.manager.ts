import { type Component, type ComponentListener, type ComponentType, type Entity } from '../types';
import { addTypeId, hasTypeId, removeTypeId, TypeId } from './type-id';

interface ComponentManagerState {
  nextId: TypeId;
  typeId: Record<ComponentType, TypeId>;
  typeIdDefaultValue: Record<TypeId, Record<string, unknown>>;
  componentEntities: Record<TypeId, Set<Entity>>;
  onAddListeners: Record<TypeId, ComponentListener[]>;
  onRemoveListeners: Record<TypeId, ComponentListener[]>;
  //
  entityComponents: Record<Entity, TypeId>;
  componentInstances: Record<Entity, Record<TypeId, Component>>;
}

const state: ComponentManagerState = {
  nextId: 0,
  typeId: {},
  typeIdDefaultValue: {},
  componentEntities: {},
  onAddListeners: {},
  onRemoveListeners: {},
  //
  entityComponents: {},
  componentInstances: {},
};

export function registerComponent<T extends Component>(
  type: ComponentType,
  defaultValue: Omit<T, 'type'>,
): void {
  if (state.typeId[type] !== undefined) {
    console.error(`registerComponent: Component (${type}) already registered`);

    return;
  }

  const typeId = (state.typeId[type] = 1 << state.nextId++);

  state.typeIdDefaultValue[typeId] = defaultValue;
  state.componentEntities[typeId] = new Set();
  state.onAddListeners[typeId] = [];
  state.onRemoveListeners[typeId] = [];
}

export function unregisterComponent(type: ComponentType): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`unregisterComponent: Component (${type}) not registered`);

    return;
  }

  delete state.typeId[type];

  const componentEntities = state.componentEntities[typeId]!;

  for (const entity of componentEntities) {
    state.entityComponents[entity] = removeTypeId(state.entityComponents[entity]!, typeId);
    delete state.componentInstances[entity]![typeId];

    emitRemoveComponentEvent(typeId, entity);
  }

  delete state.componentEntities[typeId];
  delete state.onAddListeners[typeId];
  delete state.onRemoveListeners[typeId];
}

export function addComponent<T extends Component>(
  entity: Entity,
  type: string,
  value: Partial<Omit<T, 'type'>> = {},
): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`addComponent: Component (${type}) not registered`);

    return;
  }

  const entityComponents = state.entityComponents[entity] ?? 0;

  if (hasTypeId(entityComponents, typeId)) {
    console.error(`addComponent: Component (${type}) already added`);

    return;
  }

  state.entityComponents[entity] = addTypeId(entityComponents, typeId);
  state.componentEntities[typeId]!.add(entity);

  if (state.componentInstances[entity] === undefined) {
    state.componentInstances[entity] = {};
  }

  state.componentInstances[entity]![typeId] = {
    type,
    ...state.typeIdDefaultValue[typeId],
    ...value,
  };

  emitAddComponentEvent(typeId, entity);
}

export function removeAllComponents(entity: Entity): void {
  const entityComponents = state.componentInstances[entity];

  if (entityComponents === undefined) {
    return;
  }

  delete state.componentInstances[entity];

  for (const type in entityComponents) {
    const typeId = Number(type);
    state.componentEntities[typeId]!.delete(entity);
    emitRemoveComponentEvent(typeId, entity);
  }

  delete state.entityComponents[entity];
}

export function removeComponent(entity: Entity, type: ComponentType): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`removeComponent: Component (${type}) not registered`);

    return;
  }

  const entityComponents = state.entityComponents[entity];

  if (entityComponents === undefined || !hasTypeId(entityComponents, typeId)) {
    console.error(`removeComponent: Component (${type}) was not added to Entity (${entity})`);

    return;
  }

  state.entityComponents[entity] = removeTypeId(entityComponents, typeId);
  delete state.componentInstances[entity]![typeId];
  state.componentEntities[typeId]!.delete(entity);

  emitRemoveComponentEvent(typeId, entity);
}

export function getComponent<T extends Component>(
  entity: Entity,
  type: ComponentType,
): T | undefined {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    return;
  }

  return state.componentInstances[entity]?.[typeId] as T | undefined;
}

export function getComponents<T extends Component[]>(
  entity: Entity,
  types: string[],
): Array<T | undefined> {
  return types.map((type) => getComponent(entity, type) as T | undefined);
}

export function hasComponent(entity: Entity, type: ComponentType): boolean {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    return false;
  }

  const entityComponents = state.entityComponents[entity];

  return entityComponents !== undefined && hasTypeId(entityComponents, typeId);
}

export function hasComponents(entity: Entity, types: ComponentType[]): boolean {
  return types.every((type) => hasComponent(entity, type));
}

/**
 * @internal
 */
function emitAddComponentEvent(typeId: TypeId, entity: Entity): void {
  const listeners = state.onAddListeners[typeId]!;

  for (const listener of listeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * @internal
 */
function emitRemoveComponentEvent(typeId: TypeId, entity: Entity): void {
  const listeners = state.onRemoveListeners[typeId]!;

  for (const listener of listeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * @internal
 */
export function onAddedComponent(type: ComponentType, fn: ComponentListener): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`onAddedComponent: Component (${type}) not registered`);
    return;
  }

  const listeners = state.onAddListeners[typeId];

  if (listeners === undefined) {
    return;
  }

  listeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (listeners.length > 10) {
      console.warn('onAddedComponent: exceeded the limit of 10 listeners');
    }
  }
}

/**
 * @internal
 */
export function offAddedComponent(type: ComponentType, fn: ComponentListener): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`offAddedComponent: Component (${type}) not registered`);
    return;
  }

  const listeners = state.onAddListeners[typeId];

  if (listeners === undefined) {
    return;
  }

  const index = listeners.indexOf(fn);

  if (index > -1) {
    listeners.splice(index, 1);
  }
}

/**
 * @internal
 */
export function onRemovedComponent(type: ComponentType, fn: ComponentListener): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`onRemovedComponent: Component (${type}) not registered`);
    return;
  }

  const listeners = state.onRemoveListeners[typeId];

  if (listeners === undefined) {
    return;
  }

  listeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (listeners.length > 10) {
      console.warn('onRemovedComponent: exceeded the limit of 10 listeners');
    }
  }
}

/**
 * @internal
 */
export function offRemovedComponent(type: ComponentType, fn: ComponentListener): void {
  const typeId = state.typeId[type];

  if (typeId === undefined) {
    console.error(`offRemovedComponent: Component (${type}) not registered`);
    return;
  }

  const listeners = state.onRemoveListeners[typeId];

  if (listeners === undefined) {
    return;
  }

  const index = listeners.indexOf(fn);

  if (index > -1) {
    listeners.splice(index, 1);
  }
}
