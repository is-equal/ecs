import { SystemManager } from './managers';

export { createEntity, destroyEntity, destroyAllEntities } from './managers/entity.manager';

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

export function tick(deltaTime: number): void {
  for (const system of SystemManager.getSystems()) {
    try {
      system.update(deltaTime);
    } catch (error) {
      console.error(error);
    }
  }
}
