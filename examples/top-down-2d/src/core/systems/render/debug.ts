import { world } from '@equal/ecs';
import { getCollisionBounds } from '../../helpers';
import { runInContext } from './helpers';
import type { BoxCollider2D, Camera, Tilemap, Transform } from '../../components';
import type { GameWorldContext } from '../../../setup';
import type { ReadonlyQuadTree } from '../../structures/quad-tree';
import type { Rect } from '@equal/data-structures';

declare const ctx: CanvasRenderingContext2D;

export function debugStats(context: GameWorldContext): void {
  if (context.debug !== 'stats' && context.debug !== 'all') {
    return;
  }

  runInContext(() => {
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 24px sans-serif';
    ctx.textBaseline = 'top';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(context.stats, 16, 16);
  });
}

export function debugCamera(context: GameWorldContext, camera: Camera): void {
  if (context.debug !== 'camera' && context.debug !== 'all') {
    return;
  }

  runInContext(() => {
    ctx.strokeStyle = '#0000FF';

    ctx.strokeRect(camera.bounds.x, camera.bounds.y, camera.bounds.width, camera.bounds.height);
  });
}

export function debugCollision(context: GameWorldContext): void {
  if (context.debug !== 'collision' && context.debug !== 'all') {
    return;
  }

  {
    const entity = world.getEntity('Map');

    if (entity !== undefined) {
      const tilemap = world.getComponent<Tilemap>(entity, 'Tilemap');

      if (tilemap !== undefined) {
        for (const levelId in tilemap.levels) {
          debugQuadTree(tilemap.levels[levelId].staticCollisions);
          debugQuadTree(tilemap.levels[levelId].dynamicCollisions, '#FF00FF');
        }
      }
    }
  }
  {
    const entity = world.getEntity('Player1');

    if (entity !== undefined) {
      const [transform, boxCollider] = world.getComponents<[Transform, BoxCollider2D]>(entity, [
        'Transform',
        'BoxCollider2D',
      ]);

      if (transform !== undefined && boxCollider !== undefined) {
        const bounds = getCollisionBounds(transform, boxCollider);

        runInContext(() => {
          ctx.strokeStyle = '#FFAA00';

          ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        });
      }
    }
  }
}

function debugQuadTree(
  quadtree: ReadonlyQuadTree | undefined,
  nodeColor: string = '#FFFF00',
): void {
  if (quadtree === undefined) {
    return;
  }

  runInContext(() => {
    ctx.strokeStyle = '#FFFFFF';

    ctx.strokeRect(
      quadtree.bounds.x,
      quadtree.bounds.y,
      quadtree.bounds.width,
      quadtree.bounds.height,
    );
  });

  if (!quadtree.isSubdivided()) {
    return debugQuadTreeNodes(quadtree.getNodes(), nodeColor);
  }

  debugQuadTree(quadtree.getTopLeft());
  debugQuadTree(quadtree.getTopRight());
  debugQuadTree(quadtree.getBottomRight());
  debugQuadTree(quadtree.getBottomLeft());
}

function debugQuadTreeNodes(nodes: ReadonlyArray<Readonly<Rect>>, color: string): void {
  runInContext(() => {
    ctx.strokeStyle = color;

    for (const node of nodes) {
      ctx.strokeRect(node.x, node.y, node.width, node.height);
    }
  });
}
