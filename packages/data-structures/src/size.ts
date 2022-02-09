import { clamp } from './math';

export interface Size {
  w: number;
  h: number;
}

export function size(w: number = 0, h: number = 0): Size {
  return { w, h };
}

export function clampSize(value: Size, min: Size, max: Size): Size {
  return size(clamp(value.w, min.w, max.w), clamp(value.h, min.h, max.h));
}

export function isEmptySize(size: Size): boolean {
  return size.w <= 0 || size.h <= 0;
}
