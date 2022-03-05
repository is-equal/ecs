import { world } from '@equal/ecs';
import { type Point, point, type Rect, rect, size } from '@equal/data-structures';
import {
  PlayerControllerSystemQuery,
  PlayerControllerSystemType,
  PlayerControllerSystemUpdate,
  RenderSystemQuery,
  RenderSystemType,
  RenderSystemUpdate,
  CameraSystemQuery,
  CameraSystemType,
  CameraSystemUpdate,
  PlayerState,
  SpriteAnimationSystemQuery,
  SpriteAnimationSystemType,
  SpriteAnimationSystemUpdate,
} from './core/systems';
import type {
  PlayerController,
  BoxCollider2D,
  Camera,
  Player,
  SpriteAnimation,
  SpriteRenderer,
  Tilemap,
  Transform,
} from './core/components';
import type { WorldContext } from '@equal/ecs';

export interface GameWorldContext extends WorldContext {
  debug: 'all' | 'stats' | 'collision' | 'camera' | undefined;
  stats: string;
  tileSize: number;
  viewport: Readonly<Rect>;
  viewportCenter: Readonly<Point>;
}

export function configure(): void {
  // Initialize World Context
  const viewportSize = size(window.innerWidth, window.innerHeight);
  const context = world.setContext<GameWorldContext>({
    debug: 'all',
    stats: '',
    tileSize: 16,
    viewport: rect(viewportSize.width, viewportSize.height),
    viewportCenter: point(viewportSize.width / 2, viewportSize.height / 2),
  });

  // Create Canvas
  const canvas = document.createElement('canvas');
  canvas.width = context.viewport.width;
  canvas.height = context.viewport.height;
  canvas.style.backgroundColor = '#000000';
  canvas.style.width = context.viewport.width + 'px';
  canvas.style.height = context.viewport.height + 'px';

  // @ts-expect-error: TODO
  globalThis.ctx = canvas.getContext('2d')!;

  document.body.appendChild(canvas);
}

export function register(): void {
  const context = world.getContext<GameWorldContext>();

  // General
  world.registerComponent<Transform>('Transform', {
    position: point(),
    size: size(),
    rotation: point(),
    lastPosition: point(),
  });

  // Player
  world.registerComponent<Player>('Player', {});
  world.registerComponent<PlayerController>('PlayerController', {
    speed: context.tileSize,
    direction: 0,
    state: PlayerState.Idle,
    lastState: PlayerState.Idle,
    throttling: 120,
    previousTime: 0,
  });

  // Camera
  world.registerComponent<Camera>('Camera', {
    bounds: rect(),
    follow: undefined,
    zoom: 1,
  });

  // Physic & Collision
  world.registerComponent<BoxCollider2D>('BoxCollider2D', {
    position: point(),
    size: size(),
  });

  // Sprite
  world.registerComponent<SpriteRenderer>('SpriteRenderer', {
    sprite: undefined,
    flip: undefined,
    crop: undefined,
    transparentColor: undefined,
  });
  world.registerComponent<SpriteAnimation>('SpriteAnimation', {
    selectedMapping: 0,
    mapping: {},
    frame: -1,
    maxFrames: -1,
    frameDuration: 120,
    paused: true,
    previousTime: 0,
  });

  // Map
  world.registerComponent<Tilemap>('Tilemap', {
    bounds: rect(),
    levels: {},
  });

  // Systems
  world.registerSystem(
    PlayerControllerSystemType,
    PlayerControllerSystemQuery,
    PlayerControllerSystemUpdate,
  );
  world.registerSystem(
    SpriteAnimationSystemType,
    SpriteAnimationSystemQuery,
    SpriteAnimationSystemUpdate,
  );
  world.registerSystem(CameraSystemType, CameraSystemQuery, CameraSystemUpdate);
  world.registerSystem(RenderSystemType, RenderSystemQuery, RenderSystemUpdate);
}
