import type { Component } from '@equal/ecs';

export interface SpriteRenderer extends Component {
  color: string;
  sprite: HTMLImageElement | undefined;
  repeat: 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat';
}
