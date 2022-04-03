import { world } from '@equal/ecs';
import {
  type Point,
  point,
  type Rect,
  rect,
  type Size,
  size,
  unionRect,
} from '@equal/data-structures';
import { QuadTree } from './quad-tree';
import type {
  SpriteRenderer,
  Tilemap,
  TilemapLevel,
  Transform,
  TilemapLevels,
} from '../components';

const flip: Record<number, SpriteRenderer['flip']> = {
  0: undefined,
  1: 'x',
  2: 'y',
  3: 'both',
};

export function loadTilemap(tilemap: LDTKWorld): void {
  const tilesets = loadTilesets(tilemap);

  let mapBounds = rect();
  const mapLevels: TilemapLevels = {};

  for (const level of tilemap.levels) {
    const mapLevelBounds = rect(level.pxWid, level.pxHei, level.worldX, level.worldY);
    const mapLevel: TilemapLevel = {
      bounds: mapLevelBounds,
      staticCollisions: new QuadTree(mapLevelBounds),
      interactives: new QuadTree(mapLevelBounds),
      dynamicCollisions: new QuadTree(mapLevelBounds),
    };

    for (let i = level.layerInstances.length - 1; i >= 0; i--) {
      const layer = level.layerInstances[i];

      if (layer === undefined) {
        continue;
      }

      if (layer.__type === 'IntGrid') {
        for (let i = 0; i < layer.intGridCsv.length; i++) {
          const item = layer.intGridCsv[i];

          if (item === undefined || item === 0) {
            continue;
          }

          const position = point(
            (i % layer.__cWid) * layer.__gridSize + mapLevelBounds.x,
            ((i / layer.__cHei) | 0) * layer.__gridSize + mapLevelBounds.y,
          );

          mapLevel.staticCollisions.insert(
            rect(layer.__gridSize, layer.__gridSize, position.x, position.y),
          );
        }

        continue;
      }

      if (layer.__type === 'Entities') {
        for (const entityInstance of layer.entityInstances) {
          const entity = world.createEntity();

          const position = point(
            entityInstance.px[0] + mapLevelBounds.x,
            entityInstance.px[1] + mapLevelBounds.y,
          );

          const data = entityInstance.fieldInstances.reduce(
            (result, field) => {
              if (field.__identifier === 'x') {
                result.x = field.__value as number;
              } else if (field.__identifier === 'y') {
                result.y = field.__value as number;
              } else if (field.__identifier === 'width') {
                result.width = field.__value as number;
              } else if (field.__identifier === 'height') {
                result.height = field.__value as number;
              } else if (field.__identifier === 'tileset') {
                result.tileset = field.__value as string;
              }

              return result;
            },
            {
              ...rect(layer.__gridSize, layer.__gridSize),
              tileset: undefined,
            } as Rect & {
              tileset: string | undefined;
            },
          );

          world.addComponent<Transform>(entity, 'Transform', {
            position,
            size: size(data.width, data.height),
          });

          if (data.tileset !== undefined) {
            const sprite = new Image();
            sprite.src = `resources/${data.tileset}`;

            const [pivotX, pivotY] = entityInstance.__pivot;

            world.addComponent<SpriteRenderer>(entity, 'SpriteRenderer', {
              sprite,
              pivot: getPivot(point(pivotX, pivotY), data),
              crop: rect(
                data.width,
                data.height,
                data.x * layer.__gridSize,
                data.y * layer.__gridSize,
              ),
            });
          }

          const entityBounds = rect(layer.__gridSize, layer.__gridSize, position.x, position.y);

          mapLevel.interactives.insert({ ...entityBounds, data: entity });
          mapLevel.dynamicCollisions.insert(entityBounds);
        }

        continue;
      }

      if (layer.visible && (layer.__type === 'Tiles' || layer.__type === 'AutoLayer')) {
        const tiles =
          layer.gridTiles.length === 0
            ? layer.autoLayerTiles.length === 0
              ? []
              : layer.autoLayerTiles
            : layer.gridTiles;

        for (const tile of tiles) {
          const entity = world.createEntity();
          const [x, y] = tile.px;

          world.addComponent<Transform>(entity, 'Transform', {
            position: point(x + mapLevelBounds.x, y + mapLevelBounds.y),
            size: size(layer.__gridSize, layer.__gridSize),
          });

          const tilesetImage = tilesets[layer.__tilesetDefUid];

          if (tilesetImage !== undefined) {
            const sprite = new Image();
            sprite.src = tilesetImage;

            world.addComponent<SpriteRenderer>(entity, 'SpriteRenderer', {
              sprite,
              crop: rect(layer.__gridSize, layer.__gridSize, tile.src[0], tile.src[1]),
              flip: flip[tile.f],
            });
          }
        }

        continue;
      }
    }

    mapBounds = unionRect(mapBounds, mapLevelBounds);
    mapLevels[level.identifier] = mapLevel;
  }

  const entity = world.createEntity('Map');
  world.addComponent<Tilemap>(entity, 'Tilemap', {
    bounds: mapBounds,
    levels: mapLevels,
  });
}

function loadTilesets(tilemap: LDTKWorld): Record<string, string> {
  return tilemap.defs.tilesets.reduce<Record<string, string>>(
    (data, tileset) => ({
      ...data,
      [tileset.uid]: `resources/${tileset.relPath}`,
    }),
    {},
  );
}

function getPivot(pivot: Point, size: Size): Point {
  if (pivot.x === 1 && pivot.y === 0) {
    return point(size.width / 2, 0);
  } else if (pivot.x === 1 && pivot.y === 1) {
    return point(size.width / 2, size.width / 2);
  }

  return point();
}
