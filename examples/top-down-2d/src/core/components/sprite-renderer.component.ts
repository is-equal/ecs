import type { Component } from '@equal/ecs';
import type { Color, Point, Rect } from '@equal/data-structures';

export interface SpriteRenderer extends Component {
  sprite: HTMLImageElement;
  pivot: Point;
  crop: Rect | undefined;
  transparentColor: string | Color | undefined;
  flip: 'x' | 'y' | 'both' | undefined;
}
