import { type Query, type System, type SystemInstance, type SystemType } from '../types';
import * as QueryManager from './query.manager';

interface SystemManagerState {
  instances: Map<SystemType, SystemInstance>;
}

const state: SystemManagerState = {
  instances: new Map(),
};

export function registerSystem(type: string, query: Query, update: System): void {
  if (state.instances.has(type)) {
    console.error(`registerSystem: System (${type}) already registered`);

    return;
  }

  QueryManager.registerQuery(type, query);

  state.instances.set(type, {
    update(deltaTime: number): void {
      const entities = QueryManager.executeQueryFrom(type);

      if (entities.size === 0) {
        return;
      }

      update(entities, deltaTime);
    },
  });
}

export function unregisterSystem(type: string): void {
  if (!state.instances.has(type)) {
    console.error(`unregisterSystem: System (${type}) not registered`);

    return;
  }

  state.instances.delete(type);
  QueryManager.unregisterQuery(type);
}

/**
 * @internal
 */
export function getSystems(): readonly SystemInstance[] {
  return Array.from(state.instances.values());
}
