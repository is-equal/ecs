import type { Component } from '@equal/ecs';
import type { Rect } from '@equal/data-structures';

export interface SpriteAnimation extends Component {
  selectedMapping: number;
  mapping: Record<number, Rect[]>;
  frame: number;
  maxFrames: number;
  frameDuration: number;
  //
  paused: boolean;
  previousTime: number;
}
