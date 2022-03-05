import { color, point, rect, size } from '@equal/data-structures';
import { world } from '@equal/ecs';
import { loadTilemap } from '../core/structures/map';
import {
  BoxCollider2D,
  Camera,
  Player,
  PlayerController,
  SpriteRenderer,
  Transform,
} from '../core/components';
import { SpriteAnimation } from '../core/components/sprite-animation.component';
import { PlayerDirection } from '../core/systems';
import type { GameWorldContext } from '../setup';

export async function createGameScene(): Promise<void> {
  const context = world.getContext<GameWorldContext>();

  // Map
  const mapData = await loadJSON<LDTKWorld>('/resources/map.json');
  loadTilemap(mapData);

  // Player
  const player = world.createEntity('Player1');
  world.addComponent<Transform>(player, 'Transform', {
    position: point(context.tileSize, context.tileSize * 10),
    size: size(context.tileSize, context.tileSize),
    lastPosition: point(context.tileSize, context.tileSize * 10),
  });
  world.addComponent<Player>(player, 'Player');
  world.addComponent<PlayerController>(player, 'PlayerController');
  world.addComponent<BoxCollider2D>(player, 'BoxCollider2D', {
    position: point(),
    size: size(context.tileSize, context.tileSize),
  });

  const playerSprite = new Image();
  playerSprite.src = '/resources/assets/loose sprites.png';
  world.addComponent<SpriteRenderer>(player, 'SpriteRenderer', {
    sprite: playerSprite,
    crop: rect(context.tileSize, context.tileSize),
    transparentColor: color(48, 104, 80),
  });
  world.addComponent<SpriteAnimation>(player, 'SpriteAnimation', {
    frame: 0,
    maxFrames: 4,
    selectedMapping: PlayerDirection.South,
    mapping: {
      [PlayerDirection.North]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 4),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 4),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 4),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 4),
      ],
      [PlayerDirection.South]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, 0),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, 0),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, 0),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, 0),
      ],
      [PlayerDirection.West]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 2),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 2),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 2),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 2),
      ],
      [PlayerDirection.East]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 6),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 6),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 6),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 6),
      ],
      //
      [PlayerDirection.North | PlayerDirection.West]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 3),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 3),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 3),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 3),
      ],
      [PlayerDirection.North | PlayerDirection.East]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 5),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 5),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 5),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 5),
      ],
      [PlayerDirection.South | PlayerDirection.West]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 1),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 1),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 1),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 1),
      ],
      [PlayerDirection.South | PlayerDirection.East]: [
        rect(context.tileSize, context.tileSize, context.tileSize * 0, context.tileSize * 7),
        rect(context.tileSize, context.tileSize, context.tileSize * 1, context.tileSize * 7),
        rect(context.tileSize, context.tileSize, context.tileSize * 2, context.tileSize * 7),
        rect(context.tileSize, context.tileSize, context.tileSize * 3, context.tileSize * 7),
      ],
    },
  });

  // Camera
  const camera = world.createEntity('MainCamera');
  world.addComponent<Transform>(camera, 'Transform', {
    size: size(context.viewport.width, context.viewport.height),
  });
  world.addComponent<Camera>(camera, 'Camera', {
    follow: player,
    zoom: 6,
  });
}

async function loadJSON<T>(source: string): Promise<T> {
  return fetch(source).then<T>((res) => res.json());
}
