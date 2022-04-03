/* eslint-disable */

declare module '*.ldtk' {
  const value: LDTKWorld;
  export default value;
}

declare interface LDTKWorld {
  defs: {
    tilesets: Array<{
      uid: number;
      relPath: string;
    }>;
  };
  levels: LDTKLevel[];
}

declare interface LDTKLevel {
  identifier: string;
  pxWid: number;
  pxHei: number;
  worldX: number;
  worldY: number;
  layerInstances: LDTKLayerInstance[];
}

declare interface LDTKLayerInstance {
  __identifier: string;
  __type: 'AutoLayer' | 'Tiles' | 'Entities' | 'IntGrid';
  __cWid: number;
  __cHei: number;
  __gridSize: number;
  __tilesetDefUid: number;
  visible: boolean;
  intGridCsv: number[];
  entityInstances: LDTKEntityInstance[];
  autoLayerTiles: LDTKTileInstance[];
  gridTiles: LDTKTileInstance[];
}

declare interface LDTKEntityInstance {
  __identifier: string;
  __grid: [number, number];
  __pivot: [number, number];
  __tile: number | null;
  width: number;
  height: number;
  defUid: number;
  px: [number, number];
  fieldInstances: Array<{
    __identifier: string;
    __value: unknown;
    __type: string;
  }>;
}

declare interface LDTKTileInstance {
  f: number;
  px: [number, number];
  src: [number, number];
}
