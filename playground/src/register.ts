import { point } from '@equal/data-structures';
import { world } from '@equal/ecs';
import { pipeSystem, physic2DSystem, renderSystem, collisionSystem } from './core/systems';
import type {
  Transform,
  Rigidbody2D,
  SpriteRenderer,
  BoxCollider2D,
  Bird,
  Pipe,
} from './core/components';

world.registerComponent<Bird>('Bird', {});

world.registerComponent<Pipe>('Pipe', {});

world.registerComponent<Transform>('Transform', {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  rotation: point(),
});

world.registerComponent<Rigidbody2D>('Rigidbody2D', {
  velocity: point(),
  acceleration: point(),
  gravity: 0.1,
});

world.registerComponent<BoxCollider2D>('BoxCollider2D', { x: 0, y: 0, width: 0, height: 0 });

world.registerComponent<SpriteRenderer>('SpriteRenderer', {
  color: '#FFFFFF',
  sprite: undefined,
  repeat: 'no-repeat',
});

world.registerSystem(physic2DSystem.type, physic2DSystem.query, physic2DSystem.update);
world.registerSystem(pipeSystem.type, pipeSystem.query, pipeSystem.update);
world.registerSystem(collisionSystem.type, collisionSystem.query, collisionSystem.update);
world.registerSystem(renderSystem.type, renderSystem.query, renderSystem.update);
