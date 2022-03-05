import type { Component, Query, SystemUpdate, TagComponent } from '../index';

export interface Position extends Component {
  x: number;
  y: number;
}

export interface Size extends Component {
  w: number;
  h: number;
}

export interface Texture extends Component {
  color: string;
}

export type Renderable = TagComponent;

export const positionSystemQuery: Query = ['Position', 'Size'];

export const positionSystem = jest.fn(function (): void {
  if (positionSystem.shouldThrow) {
    throw new Error('system error');
  }
}) as jest.Mock & SystemUpdate & { shouldThrow: boolean };

positionSystem.shouldThrow = false;
