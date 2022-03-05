import { Queue } from './queue';
import * as ComponentManager from './component.manager';
import type { Entity } from '../types';

interface EntityManagerState {
  nextId: number;
  availableId: Queue<Entity>;
  instances: Set<Entity>;
  labeled: Map<string, Entity>;
  entityLabel: Map<Entity, string>;
  onDestroyListeners: Record<Entity, Array<() => void>>;
}

const state: EntityManagerState = {
  nextId: 0,
  availableId: new Queue(),
  instances: new Set(),
  labeled: new Map(),
  entityLabel: new Map(),
  onDestroyListeners: {},
};

export function createEntity(label?: string): Entity {
  const entity = state.availableId.dequeue() ?? state.nextId++;

  state.instances.add(entity);

  if (label !== undefined) {
    state.labeled.set(label, entity);
    state.entityLabel.set(entity, label);
  }

  return entity;
}

export function getEntity(label: string): Entity | undefined {
  return state.labeled.get(label);
}

export function destroyEntity(entity: Entity): void {
  state.instances.delete(entity);
  state.availableId.enqueue(entity);

  const label = state.entityLabel.get(entity);

  if (label !== undefined) {
    state.labeled.delete(label);
    state.entityLabel.delete(entity);
  }

  ComponentManager.removeAllComponents(entity);

  emitOnDestroyEntity(entity);
}

export function destroyAllEntities(): void {
  for (const entity of state.instances) {
    state.instances.delete(entity);

    const label = state.entityLabel.get(entity);

    if (label !== undefined) {
      state.labeled.delete(label);
      state.entityLabel.delete(entity);
    }

    ComponentManager.removeAllComponents(entity);

    emitOnDestroyEntity(entity);
  }

  state.nextId = 0;
  state.availableId.clear();
}

export function onDestroy(entity: Entity, fn: () => void): void {
  let listeners = state.onDestroyListeners[entity];

  if (listeners === undefined) {
    listeners = state.onDestroyListeners[entity] = [];
  }

  listeners.push(fn);
}

/**
 * @internal
 */
function emitOnDestroyEntity(entity: Entity): void {
  const listeners = state.onDestroyListeners[entity];

  if (listeners === undefined) {
    return;
  }

  for (const listener of listeners) {
    try {
      listener();
    } catch (error) {
      console.error(error);
    }
  }

  delete state.onDestroyListeners[entity];
}
