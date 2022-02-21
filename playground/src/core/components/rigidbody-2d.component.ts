import type { Component } from '@equal/ecs';
import type { Point } from '@equal/data-structures';

export interface Rigidbody2D extends Component {
  velocity: Point;
  acceleration: Point;
  gravity: number;
}
