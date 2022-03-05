import { type Entity, world } from '@equal/ecs';
import { rect } from '@equal/data-structures';
import type { SpriteRenderer, SpriteAnimation } from '../components';
import type { Query, SystemUpdate } from '@equal/ecs';

export const SpriteAnimationSystemType = 'SpriteAnimation';

export const SpriteAnimationSystemQuery: Query = ['SpriteRenderer', 'SpriteAnimation'];

export const SpriteAnimationSystemUpdate: SystemUpdate = (entities, deltaTime, timestamp): void => {
  for (const entity of entities) {
    const [spriteRenderer, spriteAnimation] = getQueryComponents(entity);

    if (applyAnimationThrottling(spriteAnimation, timestamp, deltaTime)) {
      continue;
    }

    spriteAnimation.frame = spriteAnimation.paused
      ? 0
      : (spriteAnimation.frame + 1) % spriteAnimation.maxFrames;

    const frameMapping = spriteAnimation.mapping[spriteAnimation.selectedMapping];

    spriteRenderer.crop = frameMapping?.[spriteAnimation.frame] ?? rect();
  }
};

type GetQueryComponentsReturn = [SpriteRenderer, SpriteAnimation];

function getQueryComponents(entity: Entity): GetQueryComponentsReturn {
  return world.getComponents(
    entity,
    SpriteAnimationSystemQuery as string[],
  ) as GetQueryComponentsReturn;
}

function applyAnimationThrottling(
  spriteAnimation: SpriteAnimation,
  timestamp: number,
  deltaTime: number,
): boolean {
  if (spriteAnimation.previousTime === 0) {
    spriteAnimation.previousTime = timestamp;
  }

  spriteAnimation.previousTime += deltaTime;

  if (timestamp - spriteAnimation.previousTime < spriteAnimation.frameDuration) {
    return true;
  }

  spriteAnimation.previousTime = timestamp;

  return false;
}
