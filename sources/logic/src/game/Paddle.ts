export class Paddle {
  private x: number;
  private y: number;
  private h: number;
  private w: number;
  private dx: number;
  private dy: number;

  constructor(x: number, y: number, h: number = 80, w: number = 10) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.dx = 0;
    this.dy = 0;
  }
  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public toJson() {
    return { x: this.x, y: this.y, h: this.h, w: this.w };
  }
}
