import { clampPoint, point, Point } from './point';
import { clampSize, isEmptySize, Size } from './size';

export interface Rect extends Point, Size {}

export function rect(w: number = 0, h: number = 0, x: number = 0, y: number = 0): Rect {
  return { x, y, w, h };
}

export function containsPoint(rect: Rect, point: Point): boolean {
  if (isEmptyRect(rect)) {
    return false;
  }

  const minX = Math.min(rect.x, rect.x + rect.w);
  const maxX = Math.max(rect.x, rect.x + rect.w);
  const minY = Math.min(rect.y, rect.y + rect.h);
  const maxY = Math.max(rect.y, rect.y + rect.h);

  return point.x >= minX && point.x < maxX && point.y >= minY && point.y < maxY;
}

export function containsRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  return (
    containsPoint(left, point(right.x, right.y)) &&
    containsPoint(left, point(right.x + right.w, right.y + right.h))
  );
}

export function overlapsRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  return (
    containsPoint(left, point(right.x, right.y)) ||
    containsPoint(left, point(right.x + right.w, right.y + right.h)) ||
    containsPoint(right, point(left.x, left.y)) ||
    containsPoint(right, point(left.x + left.w, left.y + left.h))
  );
}

export function unionRect(left: Rect, right: Rect): Rect {
  if (isEmptyRect(right)) {
    return { ...left };
  }

  if (isEmptyRect(left)) {
    return { ...right };
  }

  const minX = Math.min(left.x, right.x);
  const maxX = Math.max(left.x + left.w, right.x + right.w);
  const minY = Math.min(left.y, right.y);
  const maxY = Math.max(left.y + left.h, right.y + right.h);

  const w = Math.ceil(maxX - minX);
  const h = Math.ceil(maxY - minY);

  return rect(w, h, minX, minY);
}

export function clampRect(value: Rect, min: Rect, max: Rect): Rect {
  return {
    ...clampPoint(value, min, max),
    ...clampSize(value, min, max),
  };
}

export function isEmptyRect(rect: Rect): boolean {
  return isEmptySize(rect);
}
