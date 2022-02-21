import { world } from '@equal/ecs';
import GameOver from '../resources/gameover.png';
import { viewport } from '../core/config';
import { createBackground, createBase } from './utils';
import type { Transform, SpriteRenderer } from '../core/components';

export function gameOverScene(): void {
  world.destroyAllEntities();

  createBackground();
  createBase();

  const gameOverWidth = 192;
  const gameOverHeight = 42;

  const gameOver = world.createEntity();

  world.addComponent<Transform>(gameOver, 'Transform', {
    x: viewport.width / 2 - gameOverWidth / 2,
    y: viewport.height / 2 - gameOverHeight,
    width: gameOverWidth,
    height: gameOverHeight,
  });

  const gameOverSprite = new Image(gameOverWidth, gameOverHeight);
  gameOverSprite.src = GameOver;

  world.addComponent<SpriteRenderer>(gameOver, 'SpriteRenderer', { sprite: gameOverSprite });
}
