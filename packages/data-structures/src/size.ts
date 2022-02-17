import { clamp } from './math';

export interface Size {
  width: number;
  height: number;
}

export function size(width: number = 0, height: number = 0): Size {
  return { width, height };
}

export function clampSize(value: Size, min: Size, max: Size): Size {
  return size(
    clamp(value.width, min.width, max.width),
    clamp(value.height, min.height, max.height),
  );
}

export function isEmptySize(size: Size): boolean {
  return size.width <= 0 || size.height <= 0;
}
