export class Ball {
  private _x: number;
  private _y: number;
  private _r: number;
  private _dx: number;
  private _dy: number;

  constructor(x: number, y: number, r: number = 20) {
    this._x = x;
    this._y = y;
    this._r = r;
    this._dx = 0;
    this._dy = 0;
  }
  public get bottom() {
    return this._y + this._r;
  }
  public get center(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }
  public get left() {
    return this._x - this._r;
  }
  public get radius() {
    return this._r;
  }
  public get right() {
    return this._x + this._r;
  }
  public get top() {
    return this._y - this._r;
  }
  public get velocity(): { dx: number; dy: number } {
    return { dx: this._dx, dy: this._dy };
  }
  public set bottom(value: number) {
    this._y = value - this._r;
  }
  public set center({ x, y }: { x?: number; y?: number }) {
    if (x !== undefined) this._x = x;
    if (y !== undefined) this._y = y;
  }
  public set left(value: number) {
    this._x = value + this._r;
  }
  public set right(value: number) {
    this._x = value - this._r;
  }
  public set top(value: number) {
    this._y = value + this._r;
  }
  public set velocity({ dx, dy }: { dx?: number; dy?: number }) {
    if (dx !== undefined) this._dx = dx;
    if (dy !== undefined) this._dy = dy;
  }
  public isStatic(): boolean {
    return this._dx === 0 && this._dy === 0;
  }
  public toJson() {
    return {
      x: this._x,
      y: this._y,
      r: this._r,
      dx: this._dx,
      dy: this._dy,
    };
  }
}
