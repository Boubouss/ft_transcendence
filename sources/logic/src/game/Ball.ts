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
  public isStatic(): boolean {
    return this.dx === 0 && this.dy === 0;
  }
  public move() {
    this.x += this.dx;
    this.y += this.dy;
  }
  public bounce(axis: "horizontal" | "vertical") {
    if (axis === "horizontal") this.dx *= -1;
    if (axis === "vertical") this.dy *= -1;
  }
  public accelarate(mul_x: number, mul_y: number) {
    this.dx *= mul_x;
    this.dy *= mul_y;
  }
  public get radius() {
    return this.r;
  }
  public get center() {
    return { x: this.x, y: this.y };
  }
  public get top() {
    return this.y - this.r;
  }
  public get right() {
    return this.x + this.r;
  }
  public get bottom() {
    return this.y + this.r;
  }
  public get left() {
    return this.x - this.r;
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
