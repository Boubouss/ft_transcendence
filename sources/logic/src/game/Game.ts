import { CreateGameRequestBody } from "../type/Interface";
import { Ball } from "./Ball";
import { GameField } from "./GameField";
import { Paddle } from "./Paddle";
import { Player } from "./Player";

export enum GameState {
  Init,
  Paused,
  Running,
}

export class Game {
  // meta data
  private gameId: string;
  private players: Map<string, Player> = new Map();

  // game objects
  private gameField: GameField;
  private paddleL: Paddle;
  private paddleR: Paddle;
  private ball: Ball;

  // ingame data
  private gameState: GameState = GameState.Init;
  private playersQueue: Array<string>;
  private playerL: string;
  private playerR: string;

  constructor(config: CreateGameRequestBody) {
    this.gameId = config.gameId;
    config.playersId.forEach((playerId: string) => {
      this.players.set(playerId, new Player(playerId));
    });

    this.playersQueue = Array(...this.players.keys());
    // might need to check the len of playersQueue or the return values
    this.playerL = this.playersQueue.shift() as string;
    this.playerR = this.playersQueue.shift() as string;

    this.gameField = new GameField();
    const h: number = this.gameField.getHeight();
    const w: number = this.gameField.getWidth();
    this.paddleL = new Paddle(20, h / 2);
    this.paddleR = new Paddle(w - 20, h / 2);
    this.ball = new Ball(w / 2, h / 2);
  }

  public getPlayersId() {
    return new Set(this.players.keys());
  }
  public getPlayersConnected() {
    return new Set(
      [...this.players.entries()]
        .filter(([_, player]) => player.isConnected())
        .map(([id, _]) => id),
    );
  }
  private setGameState(state: GameState) {
    this.gameState = state;
  }
  public setPlayerConnection(playerId: string, socket: WebSocket | null) {
    this.players.get(playerId)?.setConnected(socket);
  }
  private handleGameState() {
    const full = [...this.players.values()].every((player) =>
      player.isConnected(),
    );

    if (this.gameState == GameState.Init && full) {
      this.gameState = GameState.Running;
    } else if (this.gameState == GameState.Running && !full) {
      this.gameState = GameState.Paused;
    } else if (this.gameState == GameState.Paused && full) {
      this.gameState = GameState.Running;
    }
  }

  public toJSON() {
    return {
      gameId: this.gameId,
      state: GameState[this.gameState],
      players: [[...this.players.values()].map((player) => player.toJSON())],
      paddleR: this.paddleR.toJSON(),
      paddleL: this.paddleL.toJSON(),
      ball: this.ball.toJSON(),
    };
  }

  public setPlayerInput(playerId: string, input: "up" | "down" | null) {
    this.players.get(playerId)?.setInput(input);
  }

  public broadcast(message: string) {
    //define the game state
    this.players.forEach((player, id) => {
      if (player.isConnected()) player.getSocket()?.send(message);
    });
  }
  public update() {
    this.handleGameState();
    if (this.gameState != GameState.Running) return;
  }
}
