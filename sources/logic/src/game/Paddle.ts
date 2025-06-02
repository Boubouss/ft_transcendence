import { PlayerInput } from "../type/Type";

export class Paddle {
  private x: number;
  private y: number;
  private h: number;
  private w: number;
  private step: number;

  constructor(x: number, y: number, h: number = 80, w: number = 20, step = 10) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.step = step;
  }
  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public move(input: PlayerInput, min: number, max: number) {
    if (input === null) return;
    let step = 0;
    if (input === "up")
      step = Math.min(Math.abs(min - this.top), this.step) * -1;
    if (input === "down")
      step = Math.min(Math.abs(max - this.bottom), this.step);
    this.y += step;
  }
  public get top() {
    return this.y - this.h / 2;
  }
  public get right() {
    return this.x + this.w / 2;
  }
  public get bottom() {
    return this.y + this.h / 2;
  }
  public get left() {
    return this.x - this.w / 2;
  }
  public toJson() {
    return { x: this.x, y: this.y, h: this.h, w: this.w };
  }
}
