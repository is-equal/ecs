import 'core-js';
import { world, type Entity } from '@equal/ecs';
import { createTree, type MutableTree, type Rect } from '@equal/data-structures';
import { start } from './application';
import type { DirtyPosition, Transform } from './components';

// Browser Configuration
const root = document.getElementById('root') as HTMLCanvasElement;
// @ts-expect-error: injected
globalThis.ctx = root.getContext('2d');
// @ts-expect-error: injected
globalThis.ctx.width = globalThis.ctx.canvas.width;
// @ts-expect-error: injected
globalThis.ctx.height = globalThis.ctx.canvas.height;

// Register all components and systems
import './register';

// Start loop
start();

// Create a named tree
const rootTree = createTree<Entity>(-1, 'root');

// Create all entities
makeObject({ x: 0, y: 0, w: 256, h: 256 }, rootTree);

for (let i = 0; i < 1000; i++) {
  makeObject({ x: 0, y: 0, w: 32, h: 32 }, rootTree, true);
}

function makeObject(
  transform: Partial<Rect>,
  rootTree: MutableTree<Entity>,
  dirty: boolean = false,
): void {
  const entity = world.createEntity();
  world.addComponent<Transform>(entity, 'Transform', transform);

  if (dirty) {
    world.addComponent<DirtyPosition>(entity, 'DirtyPosition');
  }

  // Create a tree
  const entityTree = createTree<Entity>(entity);

  // Append tree to root tree
  rootTree.appendChild(entityTree);
}
