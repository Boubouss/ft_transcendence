type Pad = {
  x: 780;
  y: 301;
  h: 100;
  w: 20;
};

export type DrawPadData = {
  pad: Pad;
  ctx: CanvasRenderingContext2D;
  ratio: number;
};
