import { point } from '@equal/data-structures';
import { world } from '@equal/ecs';
import BirdMidFlap from '../resources/yellowbird-midflap.png';
import PipeGreen from '../resources/pipe-green.png';
import BackgroundDay from '../resources/background-day.png';
import Base from '../resources/base.png';
import { viewport } from '../core/config';
import type {
  Pipe,
  Transform,
  Rigidbody2D,
  SpriteRenderer,
  BoxCollider2D,
  Bird,
} from '../core/components';

export function createBird(onDead: () => void): void {
  const birdWidth = 34;
  const birdHeight = 24;

  const bird = world.createEntity();

  world.onDestroy(bird, onDead);

  world.addComponent<Bird>(bird, 'Bird');

  world.addComponent<Transform>(bird, 'Transform', {
    x: viewport.width / 4 - birdWidth / 2,
    y: viewport.height / 2 - birdHeight / 2,
    width: birdWidth,
    height: birdHeight,
  });

  world.addComponent<Rigidbody2D>(bird, 'Rigidbody2D', {
    acceleration: point(0, -0.2),
  });

  world.addComponent<BoxCollider2D>(bird, 'BoxCollider2D', {
    width: birdWidth,
    height: birdHeight,
  });

  const birdSprite = new Image(birdWidth, birdHeight);
  birdSprite.src = BirdMidFlap;

  world.addComponent<SpriteRenderer>(bird, 'SpriteRenderer', { sprite: birdSprite });
}

export function createPipe(): void {
  const pipeWidth = 52;
  const pipeHeight = 320;

  const pipe = world.createEntity();

  world.addComponent<Pipe>(pipe, 'Pipe');

  world.addComponent<Transform>(pipe, 'Transform', {
    x: viewport.width + pipeWidth,
    y: viewport.height - pipeHeight,
    width: pipeWidth,
    height: pipeHeight,
  });

  world.addComponent<Rigidbody2D>(pipe, 'Rigidbody2D', {
    velocity: point(-2, 0),
  });

  world.addComponent<BoxCollider2D>(pipe, 'BoxCollider2D', {
    width: pipeWidth,
    height: pipeHeight,
  });

  const pipeSprite = new Image(pipeWidth, pipeHeight);
  pipeSprite.src = PipeGreen;

  world.addComponent<SpriteRenderer>(pipe, 'SpriteRenderer', { sprite: pipeSprite });
}

export function createBackground(): void {
  const bgWidth = 288;
  const bgHeight = 512;

  const bg = world.createEntity();

  world.addComponent<Transform>(bg, 'Transform', {
    width: viewport.width,
    height: viewport.height,
  });

  const bgSprite = new Image(bgWidth, bgHeight);
  bgSprite.src = BackgroundDay;

  world.addComponent<SpriteRenderer>(bg, 'SpriteRenderer', {
    sprite: bgSprite,
  });
}

export function createBase(): void {
  const baseWidth = 336;
  const baseHeight = 112;

  const base = world.createEntity();

  world.addComponent<Transform>(base, 'Transform', {
    y: viewport.height - baseHeight,
    width: viewport.width,
    height: baseHeight,
  });

  const baseSprite = new Image(baseWidth, baseHeight);
  baseSprite.src = Base;

  world.addComponent<SpriteRenderer>(base, 'SpriteRenderer', {
    sprite: baseSprite,
  });

  world.addComponent<BoxCollider2D>(base, 'BoxCollider2D', {
    width: baseWidth,
    height: baseHeight,
  });
}
