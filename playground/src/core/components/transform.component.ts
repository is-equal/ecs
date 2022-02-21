import type { Component } from '@equal/ecs';
import type { Point, Size } from '@equal/data-structures';

export interface Transform extends Component, Point, Size {
  rotation: Point;
}
