export class GameField {
  private h: number;
  private w: number;

  constructor(h: number = 600, w: number = 800) {
    this.h = h;
    this.w = w;
  }
  public getHeight() {
    return this.h;
  }
  public getWidth() {
    return this.w;
  }
  public toJson() {
    return { h: this.h, w: this.w };
  }
}
