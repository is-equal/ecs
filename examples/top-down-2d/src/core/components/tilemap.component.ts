import type { Component, Entity } from '@equal/ecs';
import type { QuadTree } from '../structures/quad-tree';
import type { Rect } from '@equal/data-structures';

export interface Tilemap extends Component {
  bounds: Rect;
  levels: TilemapLevels;
}

export interface TilemapLevels {
  [levelId: string]: TilemapLevel;
}

export interface TilemapLevel {
  bounds: Rect;
  staticCollisions: QuadTree;
  interactives: QuadTree<Entity>;
  dynamicCollisions: QuadTree;
}
