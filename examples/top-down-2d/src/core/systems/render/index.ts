import { type Entity, world } from '@equal/ecs';
import { color, intersectRect, type Rect, rect } from '@equal/data-structures';
import { colorFromHEX, isColorEqual } from '@equal/data-structures/src';
import { transformToRect } from '../../helpers';
import { createOffscreenCanvas, flip, transaction, translate, zoom } from './helpers';
import { debugCamera, debugCollision, debugStats } from './debug';
import type { Camera, SpriteRenderer, Transform } from '../../components';
import type { Query, SystemUpdate } from '@equal/ecs';
import type { GameWorldContext } from '../../../setup';

declare const ctx: CanvasRenderingContext2D;

export const RenderSystemType = 'Render';

export const RenderSystemQuery: Query = ['Transform', 'SpriteRenderer'];

export const RenderSystemUpdate: SystemUpdate = (entities): void => {
  const cameraEntity = world.getEntity('MainCamera');

  if (cameraEntity === undefined) {
    console.warn('No camera found.');

    return;
  }

  const context = world.getContext<GameWorldContext>();

  transaction(() => {
    const camera = applyCamera(context, cameraEntity);

    for (const entity of entities) {
      const [transform, spriteRenderer] = getQueryComponents(entity);

      if (isOutOfCameraBounds(camera, transform)) {
        continue;
      }

      transaction(() => {
        if (spriteRenderer.sprite?.complete === true) {
          const position = flip(
            transform,
            spriteRenderer.flip === 'x' || spriteRenderer.flip === 'both',
            spriteRenderer.flip === 'y' || spriteRenderer.flip === 'both',
          );

          drawSprite(
            spriteRenderer,
            rect(transform.size.width, transform.size.height, position.x, position.y),
            spriteRenderer.crop,
          );
        } else {
          ctx.fillStyle = '#FF00FF';

          ctx.fillRect(
            transform.position.x,
            transform.position.y,
            transform.size.width,
            transform.size.height,
          );
        }
      });
    }

    debugCollision(context);
    debugCamera(context, camera);
  });

  debugStats(context);
};

type GetQueryComponentsReturn = [Transform, SpriteRenderer];

function getQueryComponents(entity: Entity): GetQueryComponentsReturn {
  return world.getComponents(entity, RenderSystemQuery as string[]) as GetQueryComponentsReturn;
}

function applyCamera(context: GameWorldContext, entity: Entity): Camera {
  ctx.clearRect(
    context.viewport.x,
    context.viewport.y,
    context.viewport.width,
    context.viewport.height,
  );

  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = 'low';

  const transform = world.getComponent<Transform>(entity, 'Transform')!;
  const camera = world.getComponent<Camera>(entity, 'Camera')!;

  zoom(camera.zoom);

  translate(
    context.viewportCenter.x / camera.zoom - transform.position.x,
    context.viewportCenter.y / camera.zoom - transform.position.y,
  );

  return camera;
}

function isOutOfCameraBounds(camera: Camera, transform: Transform): boolean {
  return !intersectRect(camera.bounds, transformToRect(transform));
}

const cachedTextures: Record<string, HTMLCanvasElement | HTMLImageElement> = {};

function drawSprite(spriteRenderer: SpriteRenderer, destination: Rect, source?: Rect): void {
  const sprite = spriteRenderer.sprite;

  if (sprite === undefined) {
    return;
  }

  const texture =
    cachedTextures[sprite.src] ?? (cachedTextures[sprite.src] = getTexture(spriteRenderer));

  if (source === undefined) {
    ctx.drawImage(texture, destination.x, destination.y, destination.width, destination.height);
  } else {
    ctx.drawImage(
      texture,
      source.x,
      source.y,
      source.width,
      source.height,
      destination.x,
      destination.y,
      destination.width,
      destination.height,
    );
  }
}

function getTexture(spriteRenderer: SpriteRenderer): HTMLCanvasElement | HTMLImageElement {
  const { sprite, transparentColor } = spriteRenderer;

  if (transparentColor === undefined) {
    return sprite!;
  }

  const offscreenCanvas = createOffscreenCanvas(sprite!.naturalWidth, sprite!.naturalHeight);
  const offscreenContext = offscreenCanvas.getContext('2d')!;

  offscreenContext.drawImage(sprite!, 0, 0);

  const texture = offscreenContext.getImageData(0, 0, sprite!.naturalWidth, sprite!.naturalHeight);
  const colorToReplace =
    typeof transparentColor === 'string' ? colorFromHEX(transparentColor) : transparentColor;

  for (let i = 0; i < texture.data.length; i += 4) {
    const textureColor = color(
      texture.data[i]!,
      texture.data[i + 1]!,
      texture.data[i + 2]!,
      texture.data[i + 3]!,
    );

    if (isColorEqual(textureColor, colorToReplace)) {
      texture.data[i] = 0;
      texture.data[i + 1] = 0;
      texture.data[i + 2] = 0;
      texture.data[i + 3] = 0;
    }
  }

  offscreenContext.putImageData(texture, 0, 0);

  return offscreenCanvas;
}
