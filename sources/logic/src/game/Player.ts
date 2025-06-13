import { PlayerInput } from "../type/Type";

export class Player {
  private _playerId: string;
  private _point: number;
  private _socket: WebSocket | null;
  private _input: PlayerInput;

  constructor(playerId: string) {
    this._playerId = playerId;
    this._point = 0;
    this._socket = null;
    this._input = null;
  }
  public get id() {
    return this._playerId;
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
  public set input(input: PlayerInput) {
    this._input = input;
  }
  public set socket(socket: WebSocket | null) {
    this._socket = socket;
  }
  public addPoint() {
    this._point++;
  }
  public isConnected() {
    return this._socket !== null;
  }
  public toJson() {
    return { playerId: this._playerId, score: this._point, input: this.input };
  }
}
