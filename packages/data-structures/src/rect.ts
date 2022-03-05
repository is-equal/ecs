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

  return (
    point.x >= rect.x &&
    point.x < rect.x + rect.width &&
    point.y >= rect.y &&
    point.y < rect.y + rect.height
  );
}

export function containsRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  return (
    containsPoint(left, point(right.x, right.y)) &&
    containsPoint(left, point(right.x + right.width, right.y)) &&
    containsPoint(left, point(right.x, right.y + right.height)) &&
    containsPoint(left, point(right.x + right.width, right.y + right.height))
  );
}

export function intersectRect(left: Rect, right: Rect): boolean {
  if (isEmptyRect(left) || isEmptyRect(right)) {
    return false;
  }

  const leftCenter = point(left.x + left.width / 2, left.y + left.height / 2);
  const rightCenter = point(right.x + right.width / 2, right.y + right.height / 2);

  const diffX = Math.abs(leftCenter.x - rightCenter.x);
  const diffY = Math.abs(leftCenter.y - rightCenter.y);

  const dx = left.width / 2 + right.width / 2;
  const dy = left.height / 2 + right.height / 2;

  return diffX < dx && diffY < dy;
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
