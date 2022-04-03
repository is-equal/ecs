import { type Entity, world } from '@equal/ecs';
import { intersectRect, type Rect } from '@equal/data-structures';
import { getCollisionBounds } from '../helpers';
import type {
  BoxCollider2D,
  PlayerController,
  SpriteAnimation,
  Tilemap,
  Transform,
} from '../components';
import type { Query, SystemUpdate } from '@equal/ecs';

export const enum PlayerState {
  Idle,
  Walking,
}

export const enum PlayerDirection {
  None = 0,
  North = 1 << 0,
  South = 1 << 1,
  West = 1 << 2,
  East = 1 << 3,
}

interface PlayerControllerSystemState {
  keyPressed: {
    use: boolean;
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;
  };
}

const state: PlayerControllerSystemState = {
  keyPressed: {
    use: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
  },
};

setupInputEvents(state);

export const PlayerControllerSystemType = 'PlayerController';

export const PlayerControllerSystemQuery: Query = [
  'PlayerController',
  'Transform',
  'BoxCollider2D',
];

export const PlayerControllerSystemUpdate: SystemUpdate = (
  entities,
  deltaTime,
  timestamp,
): void => {
  const mapEntity = world.getEntity('Map');

  if (mapEntity === undefined) {
    return;
  }

  const tilemap = world.getComponent<Tilemap>(mapEntity, 'Tilemap');

  if (tilemap === undefined) {
    return;
  }

  for (const entity of entities) {
    const [controller, transform, boxCollider] = getQueryComponents(entity);

    if (applyControllerThrottling(controller, timestamp, deltaTime)) {
      continue;
    }

    controller.lastState = controller.state;
    const spriteAnimation = world.getComponent<SpriteAnimation>(entity, 'SpriteAnimation');

    if (state.keyPressed.use) {
      controller.state = PlayerState.Idle;

      if (spriteAnimation !== undefined) {
        spriteAnimation.paused = true;
      }

      checkInteraction(tilemap, { transform, boxCollider, controller });

      continue;
    }

    const directions = applyInputActions(controller, transform);

    if (directions === PlayerDirection.None) {
      controller.state = PlayerState.Idle;

      if (spriteAnimation !== undefined) {
        spriteAnimation.paused = true;
      }
    } else {
      controller.direction = directions;
      controller.state = PlayerState.Walking;

      if (spriteAnimation !== undefined) {
        spriteAnimation.paused = false;
        spriteAnimation.selectedMapping = directions;
      }

      checkCollision(tilemap, { transform, boxCollider, directions });
    }
  }
};

type GetQueryComponentsReturn = [PlayerController, Transform, BoxCollider2D];

function getQueryComponents(entity: Entity): GetQueryComponentsReturn {
  return world.getComponents(
    entity,
    PlayerControllerSystemQuery as string[],
  ) as GetQueryComponentsReturn;
}

function applyControllerThrottling(
  controller: PlayerController,
  timestamp: number,
  deltaTime: number,
): boolean {
  if (controller.previousTime === 0) {
    controller.previousTime = timestamp;
  }

  controller.previousTime += deltaTime;

  if (timestamp - controller.previousTime < controller.throttling) {
    return true;
  }

  controller.previousTime = timestamp;

  return false;
}

function checkInteraction(
  tilemap: Tilemap,
  options: { transform: Transform; boxCollider: BoxCollider2D; controller: PlayerController },
): void {
  const { transform, boxCollider, controller } = options;

  const bounds = getCollisionBounds(transform, boxCollider);

  if (hasDirection(controller.direction, PlayerDirection.North)) {
    bounds.y -= transform.size.height;
  }

  if (hasDirection(controller.direction, PlayerDirection.South)) {
    bounds.y += transform.size.height;
  }

  if (hasDirection(controller.direction, PlayerDirection.West)) {
    bounds.x -= transform.size.width;
  }

  if (hasDirection(controller.direction, PlayerDirection.East)) {
    bounds.x += transform.size.width;
  }

  if (!intersectRect(tilemap.bounds, bounds)) {
    return;
  }

  for (const levelId in tilemap.levels) {
    const level = tilemap.levels[levelId];

    if (level === undefined) {
      continue;
    }

    const entity = level.interactives.query(bounds);

    if (entity !== undefined) {
      console.log('Interacting with: ', entity);

      return;
    }
  }
}

function applyInputActions(controller: PlayerController, transform: Transform): number {
  let directions = PlayerDirection.None;

  if (state.keyPressed.moveUp && state.keyPressed.moveDown) {
    // noop
  } else if (state.keyPressed.moveUp) {
    transform.lastPosition.y = transform.position.y;
    transform.position.y -= controller.speed;

    directions = directions | PlayerDirection.North;
  } else if (state.keyPressed.moveDown) {
    transform.lastPosition.y = transform.position.y;
    transform.position.y += controller.speed;

    directions = directions | PlayerDirection.South;
  }

  if (state.keyPressed.moveLeft && state.keyPressed.moveRight) {
    // noop
  } else if (state.keyPressed.moveLeft) {
    transform.lastPosition.x = transform.position.x;
    transform.position.x -= controller.speed;

    directions = directions | PlayerDirection.West;
  } else if (state.keyPressed.moveRight) {
    transform.lastPosition.x = transform.position.x;
    transform.position.x += controller.speed;

    directions = directions | PlayerDirection.East;
  }

  return directions;
}

function checkCollision(
  tilemap: Tilemap,
  {
    transform,
    boxCollider,
    directions,
  }: {
    transform: Transform;
    boxCollider: BoxCollider2D;
    directions: number;
  },
): void {
  const bounds = getCollisionBounds(transform, boxCollider);

  if (hasCollision(tilemap, bounds)) {
    if (
      hasDirection(directions, PlayerDirection.North) ||
      hasDirection(directions, PlayerDirection.South)
    ) {
      transform.position.y = transform.lastPosition.y;
    }

    if (
      hasDirection(directions, PlayerDirection.West) ||
      hasDirection(directions, PlayerDirection.East)
    ) {
      transform.position.x = transform.lastPosition.x;
    }
  }
}

function hasCollision(tilemap: Tilemap, bounds: Rect): boolean {
  if (!intersectRect(tilemap.bounds, bounds)) {
    return true;
  }

  for (const levelId in tilemap.levels) {
    const level = tilemap.levels[levelId];

    if (level === undefined) {
      continue;
    }

    if (level.staticCollisions.queryBoolean(bounds)) {
      return true;
    }

    if (level.dynamicCollisions.queryBoolean(bounds)) {
      return true;
    }
  }

  return false;
}

export function hasDirection(directions: number, direction: number): boolean {
  return (directions & direction) === direction;
}

//

function setupInputEvents(state: PlayerControllerSystemState): void {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE' && !state.keyPressed.use) {
      state.keyPressed.use = true;
    } else if (event.code === 'ArrowUp' && !state.keyPressed.moveUp) {
      state.keyPressed.moveUp = true;
    } else if (event.code === 'ArrowDown' && !state.keyPressed.moveDown) {
      state.keyPressed.moveDown = true;
    } else if (event.code === 'ArrowLeft' && !state.keyPressed.moveLeft) {
      state.keyPressed.moveLeft = true;
    } else if (event.code === 'ArrowRight' && !state.keyPressed.moveRight) {
      state.keyPressed.moveRight = true;
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'KeyE') {
      state.keyPressed.use = false;
    } else if (event.code === 'ArrowUp') {
      state.keyPressed.moveUp = false;
    } else if (event.code === 'ArrowDown') {
      state.keyPressed.moveDown = false;
    } else if (event.code === 'ArrowLeft') {
      state.keyPressed.moveLeft = false;
    } else if (event.code === 'ArrowRight') {
      state.keyPressed.moveRight = false;
    }
  });
}
