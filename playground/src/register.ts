import { rect, unionRect, overlapsRect, getTree } from '@equal/data-structures';
import { type Entity, world } from '@equal/ecs';
import { type DirtyPosition, type DirtyRenderer, type Transform } from './components';
import { treeTraverse } from './utils';

world.registerComponent<Transform>('Transform', rect());
world.registerComponent<DirtyPosition>('DirtyPosition', {});
world.registerComponent<DirtyRenderer>('DirtyRenderer', {});

world.registerSystem('Movement', ['Transform', 'DirtyPosition'], (entities, deltaTime) => {
  for (const entity of entities) {
    const transform = world.getComponent<Transform>(entity, 'Transform');

    if (transform === undefined) {
      continue;
    }

    transform.x = getRandomInt(0, 1280);
    transform.y = getRandomInt(0, 720);

    // world.removeComponent(entity, 'DirtyPosition');
    world.addComponent(entity, 'DirtyRenderer');
  }
});

world.registerSystem('Renderer', ['DirtyRenderer'], (entities, deltaTime) => {
  // console.group('~ RendererSystem');
  // console.log('|> Dirty Entities: %O', entities);

  let drawableRect = rect();

  for (const entity of entities) {
    const transform = world.getComponent<Transform>(entity, 'Transform');

    if (transform === undefined) {
      continue;
    }

    world.removeComponent(entity, 'DirtyRenderer');
    drawableRect = unionRect(drawableRect, transform);
  }

  // console.log('= Drawable Rect: %O', drawableRect);

  const drawableEntities: Entity[] = [];

  const rootTree = getTree<Entity>('root');

  if (rootTree === undefined) {
    throw new Error('invalid root tree');
  }

  treeTraverse(rootTree, (tree) => {
    const entity = tree.target;
    const transform = world.getComponent<Transform>(entity, 'Transform');

    if (transform === undefined) return;

    if (overlapsRect(drawableRect, transform)) {
      drawableEntities.push(entity);
    }
  });

  // console.log('<| Drew Entities: %O', drawableEntities);

  for (const entity of drawableEntities) {
    const transform = world.getComponent<Transform>(entity, 'Transform') as Transform;

    ctx.save();
    ctx.fillStyle = randomColor();
    ctx.fillRect(transform.x, transform.y, transform.width, transform.height);
    ctx.restore();
  }

  // console.groupEnd();
});

function randomColor(): string {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
