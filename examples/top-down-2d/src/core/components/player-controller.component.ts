import type { Component } from '@equal/ecs';

export interface PlayerController extends Component {
  speed: number;
  direction: number;
  //
  state: number;
  lastState: number;
  //
  throttling: number;
  previousTime: number;
}
