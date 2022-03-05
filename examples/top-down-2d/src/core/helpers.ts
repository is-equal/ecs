import { rect, type Rect } from '@equal/data-structures';
import type { BoxCollider2D, Transform } from './components';

export function transformToRect(value: Transform): Rect {
  return rect(value.size.width, value.size.height, value.position.x, value.position.y);
}

export function getCollisionBounds(transform: Transform, boxCollider: BoxCollider2D): Rect {
  return rect(
    boxCollider.size.width,
    boxCollider.size.height,
    transform.position.x + boxCollider.position.x,
    transform.position.y + boxCollider.position.y,
  );
}
