import { Queue } from './queue';
import * as ComponentManager from './component.manager';
import type { Entity } from '../types';

interface EntityManagerState {
  nextId: number;
  availableId: Queue<Entity>;
  instances: Set<Entity>;
}

const state: EntityManagerState = {
  nextId: 0,
  availableId: new Queue(),
  instances: new Set(),
};

export function createEntity(): Entity {
  const entity = state.availableId.dequeue() ?? state.nextId++;

  state.instances.add(entity);

  return entity;
}

export function destroyEntity(entity: Entity): void {
  state.instances.delete(entity);
  state.availableId.enqueue(entity);

  ComponentManager.removeAllComponents(entity);
}

export function destroyAllEntities(): void {
  for (const entity of state.instances) {
    state.instances.delete(entity);

    ComponentManager.removeAllComponents(entity);
  }

  state.nextId = 0;
  state.availableId.clear();
}
