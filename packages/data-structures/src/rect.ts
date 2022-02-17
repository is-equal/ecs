import { clampPoint, point, Point } from './point';
import { clampSize, isEmptySize, Size } from './size';

export interface Rect extends Point, Size {}

export function rect(width: number = 0, height: number = 0, x: number = 0, y: number = 0): Rect {
  return { x, y, width, height };
}

export function containsPoint(rect: Rect, point: Point): boolean {
  if (isEmptyRect(rect)) {
    return false;
  }

  const minX = Math.min(rect.x, rect.x + rect.width);
  const maxX = Math.max(rect.x, rect.x + rect.width);
  const minY = Math.min(rect.y, rect.y + rect.height);
  const maxY = Math.max(rect.y, rect.y + rect.height);

  return point.x >= minX && point.x < maxX && point.y >= minY && point.y < maxY;
}

export function containsRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  return (
    containsPoint(left, point(right.x, right.y)) &&
    containsPoint(left, point(right.x + right.width, right.y + right.height))
  );
}

export function overlapsRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  return (
    containsPoint(left, point(right.x, right.y)) ||
    containsPoint(left, point(right.x + right.width, right.y + right.height)) ||
    containsPoint(right, point(left.x, left.y)) ||
    containsPoint(right, point(left.x + left.width, left.y + left.height))
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
  const maxX = Math.max(left.x + left.width, right.x + right.width);
  const minY = Math.min(left.y, right.y);
  const maxY = Math.max(left.y + left.height, right.y + right.height);

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
