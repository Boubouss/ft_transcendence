export class Ball {
  private _x: number;
  private _y: number;
  private _r: number;
  private _dx: number;
  private _dy: number;

  constructor(x: number, y: number, r: number = 10) {
    this._x = x;
    this._y = y;
    this._r = r;
    this._dx = 0;
    this._dy = 0;
  }
  public get bottom() {
    return this._y + this._r;
  }
  public get center() {
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
  public set center({ x, y }) {
    this._x = x;
    this._y = y;
  }
  public accelarate(mul_x: number, mul_y: number) {
    this._dx *= mul_x;
    this._dy *= mul_y;
  }
  public bounce(axis: "horizontal" | "vertical") {
    if (axis === "horizontal") this._dx *= -1;
    if (axis === "vertical") this._dy *= -1;
  }
  public isStatic(): boolean {
    return this._dx === 0 && this._dy === 0;
  }
  public move() {
    this._x += this._dx;
    this._y += this._dy;
  }
  public setVelocity(dx: number, dy: number) {
    this._dx = dx;
    this._dy = dy;
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
