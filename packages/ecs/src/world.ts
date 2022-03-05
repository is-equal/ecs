import { SystemManager } from './managers';

export {
  createEntity,
  getEntity,
  destroyEntity,
  destroyAllEntities,
  onDestroy,
} from './managers/entity.manager';

export {
  registerComponent,
  unregisterComponent,
  addComponent,
  removeComponent,
  getComponents,
  getComponent,
  hasComponent,
  hasComponents,
} from './managers/component.manager';

export { registerSystem, unregisterSystem } from './managers/system.manager';

interface WorldState {
  context: WorldContext;
}

export type WorldContext = Record<string, unknown>;

const state: WorldState = {
  context: {},
};

export function setContext<T extends WorldContext>(value: T): Readonly<T> {
  return (state.context = value);
}

export function getContext<T extends WorldContext>(): Readonly<T> {
  return state.context as Readonly<T>;
}

export function tick(deltaTime: number, timestamp: number): void {
  for (const system of SystemManager.getSystems()) {
    try {
      system.update(deltaTime, timestamp);
    } catch (error) {
      console.error(error);
    }
  }
}
