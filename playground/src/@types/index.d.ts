declare let ctx: {
  width: number;
  height: number;
  save(): void;
  restore(): void;
  fillStyle: string;
  fillRect(x: number, y: number, w: number, h: number): void;
};
