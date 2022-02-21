import { world } from '@equal/ecs';
import Message from '../resources/message.png';
import { viewport } from '../core/config';
import { createBackground, createBase } from './utils';
import type { Transform, SpriteRenderer } from '../core/components';

export function startScene(): void {
  world.destroyAllEntities();

  createBackground();
  createBase();

  const messageWidth = 184;
  const messageHeight = 267;

  const message = world.createEntity();

  world.addComponent<Transform>(message, 'Transform', {
    x: viewport.width / 2 - messageWidth / 2,
    y: viewport.height / 2 - messageHeight / 1.2,
    width: messageWidth,
    height: messageHeight,
  });

  const messageSprite = new Image(messageWidth, messageHeight);
  messageSprite.src = Message;

  world.addComponent<SpriteRenderer>(message, 'SpriteRenderer', { sprite: messageSprite });
}
