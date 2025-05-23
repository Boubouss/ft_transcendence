import { PlayerInput } from "../type/Type";

export class Paddle {
  private x: number;
  private y: number;
  private h: number;
  private w: number;
  private step: number;

  constructor(x: number, y: number, h: number = 80, w: number = 10, step = 5) {
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
  public move(input: PlayerInput) {
    if (input === null) return;
    if (input === "up") this.y -= this.step;
    if (input === "down") this.y += this.step;
  }
  public get top() {
    return this.y - this.h / 2;
  }
  public get right() {
    return this.y + this.w / 2;
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
