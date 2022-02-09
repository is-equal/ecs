import { EntityManager, ComponentManager, SystemManager } from './managers';
import type { Entity } from './types';

interface WorldState {
  destroyAllEntities: boolean;
  entitiesToDestroy: Entity[];
  componentsToUnregister: string[];
  systemsToUnregister: string[];
}

const state: WorldState = {
  destroyAllEntities: false,
  entitiesToDestroy: [],
  componentsToUnregister: [],
  systemsToUnregister: [],
};

export function tick(deltaTime: number): void {
  // Unregister the systems
  const systemsToUnregister = state.systemsToUnregister;
  state.systemsToUnregister = [];

  for (const system of systemsToUnregister) {
    SystemManager.unregisterSystem(system);
  }

  // Unregister the components
  const componentsToUnregister = state.componentsToUnregister;
  state.componentsToUnregister = [];

  for (const component of componentsToUnregister) {
    ComponentManager.unregisterComponent(component);
  }

  // Destroy entities
  if (state.destroyAllEntities) {
    EntityManager.destroyAllEntities();

    state.destroyAllEntities = false;
  } else {
    const entitiesToDestroy = state.entitiesToDestroy;
    state.entitiesToDestroy = [];

    for (const entity of entitiesToDestroy) {
      EntityManager.destroyEntity(entity);
    }
  }

  // Update the systems
  const systems = SystemManager.getSystems();

  for (const system of systems) {
    try {
      system.update(deltaTime);
    } catch (error) {
      console.error(error);
    }
  }
}

export function destroyEntity(entity: Entity): void {
  state.entitiesToDestroy.push(entity);
}

export function destroyAllEntities(): void {
  state.destroyAllEntities = true;
}

export function unregisterComponent(component: string): void {
  state.componentsToUnregister.push(component);
}

export function unregisterSystem(system: string): void {
  state.systemsToUnregister.push(system);
}

export { createEntity } from './managers/entity.manager';
export {
  registerComponent,
  addComponent,
  getComponents,
  getComponent,
  hasComponent,
  hasComponents,
  removeComponent,
} from './managers/component.manager';
export { registerSystem } from './managers/system.manager';
