import type { Entity } from './entity';

export type ComponentType = `Component::${string}`;

export interface Component {
  readonly type: ComponentType;
}

export interface TagComponent {
  readonly type: ComponentType;
}

export type ComponentListener = (entity: Entity) => void;
