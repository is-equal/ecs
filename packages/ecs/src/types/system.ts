import type { Entity } from './entity';

export type SystemType = Readonly<string>;

export type System = (entities: ReadonlySet<Entity>, deltaTime: number) => void;

export type SystemInstance = Readonly<{ update: (deltaTime: number) => void }>;
