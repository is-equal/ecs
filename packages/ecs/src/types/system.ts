import type { Entity } from './entity';

export type SystemType = Readonly<`System::${string}`>;

/**
 * List with all Component names, the entity **should** have all Components listed
 * to be consumed by the System.
 */
export type SystemQuery = ReadonlySet<string>;

export type SystemName = Readonly<string>;

export type System = (entities: readonly Entity[], deltaTime: number) => void;

export type SystemInstance = Readonly<{ update: (deltaTime: number) => void }>;
