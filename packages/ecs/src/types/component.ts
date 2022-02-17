import type { Entity } from './entity';

export type ComponentType = Readonly<string>;

export interface Component {
  readonly type: ComponentType;
}

export interface TagComponent {
  readonly type: ComponentType;
}

export type ComponentListener = (entity: Entity) => void;

export type UnregisterComponentListener = (type: ComponentType) => void;
