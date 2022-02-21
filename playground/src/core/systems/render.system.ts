import { type Query, type System, world } from '@equal/ecs';
import { viewport } from '../config';
import type { Transform, SpriteRenderer } from '../components';

declare const ctx: CanvasRenderingContext2D;

interface RenderSystem {
  type: string;
  query: Query;
  update: System;
}

export const renderSystem: RenderSystem = {
  type: 'Render',
  query: ['Transform', 'SpriteRenderer'],
  update(entities, deltaTime) {
    ctx.clearRect(viewport.x, viewport.y, viewport.width, viewport.height);

    for (const entity of entities) {
      const transform = world.getComponent<Transform>(entity, 'Transform')!;
      const sprite = world.getComponent<SpriteRenderer>(entity, 'SpriteRenderer')!;

      ctx.save();

      const hasRotation = transform.rotation.x !== 0;

      if (hasRotation) {
        const rad = (transform.rotation.x * Math.PI) / 180;

        ctx.translate(transform.x + transform.width / 2, transform.y + transform.height / 2);

        ctx.rotate(rad);
      }

      const x = hasRotation ? 0 : transform.x;
      const y = hasRotation ? 0 : transform.y;

      if (sprite.sprite !== undefined && sprite.sprite.complete) {
        if (sprite.repeat !== 'no-repeat') {
          const pattern = ctx.createPattern(sprite.sprite, sprite.repeat)!;

          ctx.fillStyle = pattern;
          ctx.fillRect(x, y, transform.width, transform.height);
        } else {
          ctx.drawImage(sprite.sprite, x, y, transform.width, transform.height);
        }
      } else {
        ctx.fillStyle = sprite.color;
        ctx.fillRect(x, y, transform.width, transform.height);
      }

      ctx.restore();
    }
  },
};
