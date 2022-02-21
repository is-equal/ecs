import { type Query, type System, world } from '@equal/ecs';
import { getRandomInt } from '../../utils';
import { viewport } from '../config';
import type { Transform, Rigidbody2D } from '../components';

interface PipeSystem {
  type: string;
  query: Query;
  state: {
    delayToStart: number;
  };
  isReusable(transform: Transform): boolean;
  update: System;
}

export const pipeSystem: PipeSystem = {
  type: 'Pipe',
  query: ['Pipe', 'Transform', 'Rigidbody2D'],
  state: {
    delayToStart: 0,
  },
  isReusable(transform) {
    return transform.x + transform.width < viewport.x;
  },
  update(entities, deltaTime) {
    if (pipeSystem.state.delayToStart <= 100) {
      pipeSystem.state.delayToStart += 1;

      return;
    }

    for (const entity of entities) {
      const transform = world.getComponent<Transform>(entity, 'Transform')!;

      if (pipeSystem.isReusable(transform)) {
        transform.x = viewport.width;
        const height = getRandomInt(320 / 2, 320);
        transform.y = viewport.height - height;
        transform.height = height;
        continue;
      }

      const rig = world.getComponent<Rigidbody2D>(entity, 'Rigidbody2D')!;

      transform.x += rig.velocity.x;
    }
  },
};
