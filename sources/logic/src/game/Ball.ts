export class Ball {
  private x: number;
  private y: number;
  private r: number;
  private dx: number;
  private dy: number;

  constructor(x: number, y: number, r: number = 10) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = 0;
    this.dy = 0;
  }
  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public setVelocity(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
  public toJson() {
    return {
      x: this.x,
      y: this.y,
      r: this.r,
      dx: this.dx,
      dy: this.dy,
    };
  }
}
