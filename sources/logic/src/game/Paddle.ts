export class Paddle {
  private _x: number;
  private _y: number;
  private _h: number;
  private _w: number;
  private _step: number;

  constructor(
    x: number,
    y: number,
    h: number = 200,
    w: number = 20,
    step = 10,
  ) {
    this._x = x;
    this._y = y;
    this._h = h;
    this._w = w;
    this._step = step;
  }
  public get bottom() {
    return this._y + this._h / 2;
  }
  public get center(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }
  public get left() {
    return this._x - this._w / 2;
  }
  public get right() {
    return this._x + this._w / 2;
  }
  public get top() {
    return this._y - this._h / 2;
  }
  public get width() {
    return this._w;
  }
  public get height() {
    return this._h;
  }
  public get step() {
    return this._step;
  }
  public set bottom(value: number) {
    this._y = value - this._h / 2;
  }
  public set center({ x, y }: { x?: number; y?: number }) {
    if (x !== undefined) this._x = x;
    if (y !== undefined) this._y = y;
  }
  public set left(value: number) {
    this._x = value + this._w / 2;
  }
  public set right(value: number) {
    this._x = value - this._w / 2;
  }
  public set top(value: number) {
    this._y = value + this._h / 2;
  }
  public toJson() {
    return { x: this._x, y: this._y, h: this._h, w: this._w };
  }
}
