import { world } from '@equal/ecs';
import { createBackground, createBase, createBird, createPipe } from './utils';

export function gameScene(onGameover: () => void): void {
  world.destroyAllEntities();

  createBackground();

  createPipe();

  createBird(onGameover);

  createBase();
}
