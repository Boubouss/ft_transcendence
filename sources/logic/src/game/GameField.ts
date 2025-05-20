export class GameField {
  private _h: number;
  private _w: number;

  constructor(h: number = 600, w: number = 800) {
    this._h = h;
    this._w = w;
  }
  public get height() {
    return this._h;
  }
  public get width() {
    return this._w;
  }
  public toJson() {
    return { h: this._h, w: this._w };
  }
}
