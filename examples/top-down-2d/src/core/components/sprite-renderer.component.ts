import type { Component } from '@equal/ecs';
import type { Color, Rect } from '@equal/data-structures';

export interface SpriteRenderer extends Component {
  sprite: HTMLImageElement | undefined;
  crop: Rect | undefined;
  transparentColor: string | Color | undefined;
  flip: 'x' | 'y' | 'both' | undefined;
}
