import { clamp } from './math';

export interface Point {
  x: number;
  y: number;
}

export function point(x: number = 0, y: number = 0): Point {
  return { x, y };
}

export function clampPoint(value: Point, min: Point, max: Point): Point {
  return point(clamp(value.x, min.x, max.x), clamp(value.y, min.y, max.y));
}
