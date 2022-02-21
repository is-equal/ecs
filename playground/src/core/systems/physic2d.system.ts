import { type Query, type System, world } from '@equal/ecs';
import { clamp } from '@equal/data-structures';
import { viewport } from '../config';
import type { Transform, Rigidbody2D } from '../components';

interface Physic2DSystem {
  type: string;
  state: {
    tap: boolean;
    groundPosY: number;
  };
  query: Query;
  isOnSky(transform: Transform): boolean;
  isOnGround(transform: Transform): boolean;
  isAboveSky(transform: Transform): boolean;
  isBelowGround(transform: Transform): boolean;
  update: System;
}

export const physic2DSystem: Physic2DSystem = {
  type: 'Physic2D',
  query: ['Bird', 'Transform', 'Rigidbody2D'],
  state: {
    tap: false,
    groundPosY: viewport.height - 112,
  },
  isOnSky(transform) {
    return transform.y === viewport.y;
  },
  isOnGround(transform) {
    return transform.y + transform.height === physic2DSystem.state.groundPosY;
  },
  isAboveSky(transform) {
    return transform.y < viewport.y;
  },
  isBelowGround(transform) {
    return transform.y + transform.height > physic2DSystem.state.groundPosY;
  },
  update(entities, deltaTime) {
    for (const entity of entities) {
      const transform = world.getComponent<Transform>(entity, 'Transform')!;

      if (
        (physic2DSystem.isOnSky(transform) && physic2DSystem.state.tap) ||
        (physic2DSystem.isOnGround(transform) && !physic2DSystem.state.tap)
      ) {
        continue;
      }

      const rig = world.getComponent<Rigidbody2D>(entity, 'Rigidbody2D')!;

      // vel = vel + accel * dt
      // pos = pos + vel * dt

      if (physic2DSystem.state.tap) {
        rig.velocity.y += rig.acceleration.y;
      } else {
        rig.velocity.y += rig.gravity;
      }

      transform.y += rig.velocity.y;

      transform.rotation.x = clamp(transform.rotation.x + rig.velocity.y, -15, 15);

      if (physic2DSystem.isAboveSky(transform)) {
        transform.y = 0;
        rig.velocity.y = 0;
      } else if (physic2DSystem.isBelowGround(transform)) {
        transform.y = physic2DSystem.state.groundPosY - transform.height;
        rig.velocity.y = 0;
      }
    }
  },
};
