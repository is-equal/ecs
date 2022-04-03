import { point, type Point } from '@equal/data-structures';
import { Transform } from '../../components';

declare const ctx: CanvasRenderingContext2D;

export function runInContext(fn: () => void): void {
  ctx.save();

  fn();

  ctx.restore();
}

export function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  return offscreenCanvas;
}

export function translate(x: number, y: number): void {
  ctx.translate(x, y);
}

export function zoom(factor: number): void {
  ctx.scale(factor, factor);
}

export function flip(transform: Transform, axisX: boolean, axisY: boolean): Point {
  if (!axisX && !axisY) {
    return point(transform.position.x, transform.position.y);
  }

  if (axisX && !axisY) {
    translate(transform.position.x + transform.size.width, 0);

    ctx.scale(-1, 1);

    return point(0, transform.position.y);
  }

  if (!axisX && axisY) {
    translate(0, transform.position.y + transform.size.height);

    ctx.scale(1, -1);

    return point(transform.position.x, 0);
  }

  translate(
    transform.position.x + transform.size.width,
    transform.position.y + transform.size.height,
  );

  ctx.scale(-1, -1);

  return point(0, 0);
}
