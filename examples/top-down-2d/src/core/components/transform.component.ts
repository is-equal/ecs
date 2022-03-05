import { type Point, type Size } from '@equal/data-structures';
import type { Component } from '@equal/ecs';

export interface Transform extends Component {
  position: Point;
  size: Size;
  rotation: Point;
  lastPosition: Point;
}
