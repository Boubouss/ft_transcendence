import { PlayerInput } from "../type/Type";

export class Player {
  private playerId: string;
  private point: number;
  private socket: WebSocket | null;
  private input: PlayerInput;
  constructor(playerId: string) {
    this.playerId = playerId;
    this.point = 0;
    this.socket = null;
    this.input = null;
  }
  public isConnected() {
    return this.socket !== null;
  }
  public getId() {
    return this.playerId;
  }
  public setConnected(socket: WebSocket | null) {
    this.socket = socket;
  }
  public getSocket() {
    return this.socket;
  }
  public setInput(input: PlayerInput) {
    this.input = input;
  }
  public getInput() {
    return this.input;
  }
  public addPoint() {
    this.point++;
  }
  public getPoint() {
    this.point++;
  }
  public toJson() {
    return { playerId: this.playerId, score: this.point, input: this.input };
  }
}
