import { offDestroyEntity, onDestroyEntity } from './entity.manager';
import {
  hasComponents,
  offAddComponent,
  offRemoveComponent,
  onAddComponent,
  onRemoveComponent,
} from './component.manager';
import type {
  ComponentListener,
  Entity,
  EntityListener,
  System,
  SystemInstance,
  SystemQuery,
  SystemType,
} from '../types';

interface SystemManagerState {
  types: Map<SystemType, SystemQuery>;
  instances: Map<SystemType, SystemInstance>;
  entities: Map<SystemType, Set<Entity>>;
  entityListeners: Map<SystemType, ComponentListener>;
  componentListeners: Map<SystemType, ComponentListener>;
}

const state: SystemManagerState = {
  types: new Map(),
  instances: new Map(),
  entities: new Map(),
  entityListeners: new Map(),
  componentListeners: new Map(),
};

export function registerSystem(name: string, query: readonly string[], update: System): void {
  const type = makeType(name);

  if (state.types.has(type)) {
    console.error(`System (${name}) already registered`);

    return;
  }

  const instance: SystemInstance = Object.seal({
    update(deltaTime: number): void {
      const entities = getSystemEntities(name);

      if (entities.length === 0) {
        return;
      }

      update(entities, deltaTime);
    },
  });

  state.types.set(type, new Set(query));
  state.instances.set(type, instance);
  state.entities.set(type, new Set());

  const entityListener = (entity: Entity): void => {
    const entities = state.entities.get(type) as Set<Entity>;

    entities.delete(entity);
  };

  onDestroyEntity(entityListener);

  state.entityListeners.set(type, entityListener);

  const componentListener = (entity: Entity): void => {
    const entities = state.entities.get(type) as Set<Entity>;

    if (hasComponents(entity, Array.from(query))) {
      entities.add(entity);
    } else {
      entities.delete(entity);
    }
  };

  onAddComponent(componentListener);
  onRemoveComponent(componentListener);

  state.componentListeners.set(type, componentListener);
}

export function unregisterSystem(name: string): void {
  const type = makeType(name);

  if (!state.types.has(type)) {
    console.error(`System (${name}) not registered`);

    return;
  }

  state.types.delete(type);
  state.instances.delete(type);
  state.entities.delete(type);

  const entityListener = state.entityListeners.get(type) as EntityListener;

  offDestroyEntity(entityListener);

  const componentListener = state.componentListeners.get(type) as ComponentListener;

  offAddComponent(componentListener);
  offRemoveComponent(componentListener);
}

export function getSystems(): readonly SystemInstance[] {
  return Array.from(state.instances.values());
}

/**
 * @internal
 */
export function getSystemEntities(name: string): readonly Entity[] {
  const type = makeType(name);

  if (!state.types.has(type)) {
    console.error(`System (${name}) not registered`);

    return [];
  }

  const entities = state.entities.get(type) as Set<Entity>;

  return Array.from(entities);
}

function makeType(name: string): SystemType {
  return `System::${name}`;
}
