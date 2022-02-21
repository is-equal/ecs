import { type Entity, type Query, type System, world } from '@equal/ecs';
import { type Rect, rect } from '@equal/data-structures';
import { viewport } from '../config';
import { QuadTree } from '../quad-tree';
import type { BoxCollider2D, Transform } from '../components';

interface CollisionSystem {
  type: string;
  query: Query;
  update: System;
}

const quadtree = new QuadTree(rect(viewport.width + 1, viewport.height + 1));

export const collisionSystem: CollisionSystem = {
  type: 'Collision',
  query: ['BoxCollider2D', 'Transform'],
  update(entities, deltaTime) {
    quadtree.clear();

    let birdEntity: Entity | undefined;
    let birdColliderRect: Rect | undefined;

    for (const entity of entities) {
      const transform = world.getComponent<Transform>(entity, 'Transform')!;
      const boxCollider = world.getComponent<BoxCollider2D>(entity, 'BoxCollider2D')!;
      const colliderRect = rect(
        boxCollider.width,
        boxCollider.height,
        transform.x + boxCollider.x,
        transform.y + boxCollider.y,
      );

      if (world.hasComponent(entity, 'Bird')) {
        birdEntity = entity;
        birdColliderRect = colliderRect;
      } else {
        quadtree.insert(colliderRect);
      }
    }

    if (birdColliderRect !== undefined && birdEntity !== undefined) {
      const collisions = quadtree.query(birdColliderRect);

      if (collisions.length > 0) {
        world.destroyEntity(birdEntity);
      }
    }
  },
};
