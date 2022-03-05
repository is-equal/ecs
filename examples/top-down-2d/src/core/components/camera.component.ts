import type { Component, Entity } from '@equal/ecs';
import type { Rect } from '@equal/data-structures';

export interface Camera extends Component {
  bounds: Rect;
  follow: Entity | undefined;
  zoom: number;
}
