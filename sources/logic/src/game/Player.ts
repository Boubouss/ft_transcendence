import { MessageTypes } from "../type/Schema";

export class Player {
  private _id: string;
  private _point: number;
  private _socket: WebSocket | null;
  private _input: MessageTypes["input"]["value"];
  private _pause = false;

  constructor(id: string) {
    this._id = id;
    this._point = 0;
    this._socket = null;
    this._input = null;
    this._pause = false;
  }
  public get id() {
    return this._id;
  }
  public get input() {
    return this._input;
  }
  public get point() {
    return this._point;
  }
  public get socket() {
    return this._socket;
  }
  public get pause(): boolean {
    return this._pause;
  }
  public set input(input: MessageTypes["input"]["value"]) {
    this._input = input;
  }
  public set socket(socket: WebSocket | null) {
    this._socket = socket;
  }
  public set pause(value: MessageTypes["pause"]["value"]) {
    if (value === "pause") this._pause = true;
    else if (value === "unpause") this._pause = false;
    else if (value === "flip") this._pause = !this._pause;
  }
  public addPoint() {
    this._point++;
  }
  public isConnected() {
    return this._socket !== null;
  }
  public toJson() {
    return {
      id: this._id,
      score: this._point,
      input: this._input,
      pause: this._pause,
    };
  }
}
