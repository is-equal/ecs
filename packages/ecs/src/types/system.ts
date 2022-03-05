import type { Entity } from './entity';

export type SystemType = Readonly<string>;

export type SystemUpdate = (
  entities: ReadonlySet<Entity>,
  deltaTime: number,
  timestamp: number,
) => void;

export type SystemInstance = Readonly<{ update: (deltaTime: number, timestamp: number) => void }>;
