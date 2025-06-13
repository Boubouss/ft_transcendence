import { PlayerInput } from "../type/Type";

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
  public get center() {
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
  public set center({ x, y }) {
    this._x = x;
    this._y = y;
  }
  public move(input: PlayerInput, min: number, max: number) {
    if (input === null) return;
    let step = 0;
    if (input === "up")
      step = Math.min(Math.abs(min - this.top), this._step) * -1;
    if (input === "down")
      step = Math.min(Math.abs(max - this.bottom), this._step);
    this._y += step;
  }
  public toJson() {
    return { x: this._x, y: this._y, h: this._h, w: this._w };
  }
}
