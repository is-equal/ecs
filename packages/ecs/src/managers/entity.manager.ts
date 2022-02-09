import { Queue } from './queue';
import type { Entity, EntityListener } from '../types';

interface EntityManagerState {
  nextId: number;
  availableId: Queue<Entity>;
  instances: Set<Entity>;
  onCreateListeners: EntityListener[];
  onDestroyListeners: EntityListener[];
}

const state: EntityManagerState = {
  nextId: 0,
  availableId: new Queue(),
  instances: new Set(),
  onCreateListeners: [],
  onDestroyListeners: [],
};

export function createEntity(): Entity {
  const entity = state.availableId.dequeue() ?? state.nextId++;

  state.instances.add(entity);

  onCreateListeners(entity);

  return entity;
}

export function destroyEntity(entity: Entity): void {
  state.instances.delete(entity);

  onDestroyListeners(entity);

  state.availableId.enqueue(entity);
}

export function destroyAllEntities(): void {
  for (const entity of state.instances) {
    destroyEntity(entity);
  }
}

function onCreateListeners(entity: Entity): void {
  for (const listener of state.onCreateListeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

function onDestroyListeners(entity: Entity): void {
  for (const listener of state.onDestroyListeners) {
    try {
      listener(entity);
    } catch (error) {
      console.error(error);
    }
  }
}

export function onCreateEntity(fn: EntityListener): void {
  state.onCreateListeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (state.onCreateListeners.length > 10) {
      console.warn('onCreateListeners: exceeded the limit of 10 listeners');
    }
  }
}

export function offCreateEntity(fn: EntityListener): void {
  const index = state.onCreateListeners.findIndex((listener) => fn === listener);

  if (index > -1) {
    state.onCreateListeners.splice(index, 1);
  }
}

export function onDestroyEntity(fn: EntityListener): void {
  state.onDestroyListeners.push(fn);

  if (process.env.NODE_ENV !== 'production') {
    if (state.onDestroyListeners.length > 10) {
      console.warn('onDestroyListeners: exceeded the limit of 10 listeners');
    }
  }
}

export function offDestroyEntity(fn: EntityListener): void {
  const index = state.onDestroyListeners.findIndex((listener) => fn === listener);

  if (index > -1) {
    state.onDestroyListeners.splice(index, 1);
  }
}
