import { Ball } from "./Ball";
import { CreateGameRequestBody } from "../type/Interface";
import { GameField } from "./GameField";
import { GameState } from "../type/Enum";
import { Paddle } from "./Paddle";
import { Player } from "./Player";
import { PlayerInput } from "../type/Type";
import * as other from "./other";

const PADDLE_OFFSET: number = 20;

export class Game {
  private _gameId: string;
  private _players: Map<string, Player> = new Map();

  private _gameField: GameField;
  private _paddleL: Paddle;
  private _paddleR: Paddle;
  private _ball: Ball;

  private _gameState: GameState = GameState.Init;
  private _playersQueue: Array<string>;
  private _playerL: string | null;
  private _playerR: string | null;
  private _maxScore: number;

  private _sleep: number;
  private _fps: 30 | 60;

  constructor(config: CreateGameRequestBody, fps: 30 | 60) {
    this._fps = fps;
    this._sleep = 0;

    this._gameId = config.gameId;
    config.playersId.forEach((playerId: string) => {
      this._players.set(playerId, new Player(playerId));
    });

    this._playersQueue = Array(...this._players.keys());
    if (this._players.size !== 2) other.shuffle(this._playersQueue);
    this._playerL = this._playersQueue.shift() ?? null;
    this._playerR = this._playersQueue.shift() ?? null;

    this._gameField = new GameField();
    const h: number = this._gameField.height;
    const w: number = this._gameField.width;
    this._paddleL = new Paddle(PADDLE_OFFSET, h / 2);
    this._paddleR = new Paddle(w - PADDLE_OFFSET, h / 2);
    this._ball = new Ball(w / 2, h / 2);

    this._maxScore = config.scoreMax;
  }
  public get gameState() {
    return this._gameState;
  }
  public get playersId() {
    return new Set(this._players.keys());
  }
  public get playersConnected() {
    return new Set(
      [...this._players.entries()]
        .filter(([_, player]) => player.isConnected())
        .map(([id, _]) => id),
    );
  }
  private resetObjects() {
    if (this._players.size !== 2) other.shuffle(this._playersQueue);
    const h: number = this._gameField.height;
    const w: number = this._gameField.width;
    this._paddleL.center = { x: PADDLE_OFFSET, y: h / 2 };
    this._paddleR.center = { x: w - PADDLE_OFFSET, y: h / 2 };
    this._ball.center = { x: w / 2, y: h / 2 };
    this._ball.setVelocity(0, 0);
  }
  private resetQueue() {
    this._playersQueue = Array(...this._players.keys());
    if (this._players.size !== 2) other.shuffle(this._playersQueue);
    this._playerL = this._playersQueue.shift() as string;
    this._playerR = this._playersQueue.shift() as string;
  }
  public setPlayerConnection(playerId: string, socket: WebSocket | null) {
    const player = this._players.get(playerId);
    if (player !== undefined) player.socket = socket;
  }
  public setPlayerInput(playerId: string, input: PlayerInput) {
    const player = this._players.get(playerId);
    if (!player) return;
    player.input = input;
  }
  public isFull() {
    return ![...this._players.values()].some((p) => !p.isConnected());
  }
  public isEmpty() {
    return [...this._players.values()].every((p) => !p.isConnected());
  }
  private overlap(ball: Ball, paddle: Paddle): boolean {
    const center = ball.center;
    const pX = Math.max(paddle.left, Math.min(center.x, paddle.right));
    const pY = Math.max(paddle.top, Math.min(center.y, paddle.bottom));
    const dist = Math.sqrt((center.x - pX) ** 2 + (center.y - pY) ** 2);
    return dist <= ball.radius;
  }
  public broadcast(message: string) {
    this._players.forEach((player, _) => {
      if (!player.isConnected()) return;
      if (!player.socket) return;
      player.socket.send(message);
    });
  }
  public toJson() {
    return {
      gameId: this._gameId,
      state: GameState[this._gameState],
      players: [[...this._players.values()].map((player) => player.toJson())],
      queue: this._playersQueue,
      field: this._gameField.toJson(),
      playerL: this._playerL,
      playerR: this._playerR,
      paddleR: this._paddleR.toJson(),
      paddleL: this._paddleL.toJson(),
      ball: this._ball.toJson(),
    };
  }
  public update() {
    //todo: websocket could set to false onclose and we recheck only if false
    if (this._gameState == GameState.Init && this.isFull()) {
      this._sleep = 1 * this._fps;
      this._gameState = GameState.Running;
    } else if (this._gameState == GameState.Running && !this.isFull()) {
      this._gameState = GameState.Paused;
    } else if (this._gameState == GameState.Paused && this.isFull()) {
      this._sleep = 1 * this._fps;
      this._gameState = GameState.Running;
    }

    //todo: replace this code block ?
    const winners = [...this._players.entries()].filter(
      ([_, p]) => p.point >= this._maxScore,
    );
    //todo: check for multiple winners error ?
    if (winners.length !== 0) {
      this._gameState = GameState.Over;
      return;
    }

    if (this._gameState != GameState.Running) return;
    if (this._sleep > 0) return this._sleep--;

    //todo: replace with better values
    if (this._ball.isStatic()) {
      let dx = Math.ceil(Math.random() * 10);
      let dy = Math.ceil(Math.random() * 10);
      if (Math.floor(Math.random() * 2) % 2) dx *= -1;
      if (Math.floor(Math.random() * 2) % 2) dy *= -1;
      this._ball.setVelocity(dx, dy);
    }

    const pairPlayerPaddle = [
      [this._playerL, this._paddleL],
      [this._playerR, this._paddleR],
    ] as [string, Paddle][];

    for (const [playerId, paddle] of pairPlayerPaddle) {
      let player, input;
      if (!(player = this._players.get(playerId))) continue;
      if (!(input = player.input)) continue;
      paddle.move(input, 0, this._gameField.height);
    }

    this._ball.move();

    if (this._ball.top <= 0 || this._ball.bottom >= this._gameField.height)
      this._ball.bounce("vertical");

    //todo: consider the horizontal bounce
    for (const [_, paddle] of pairPlayerPaddle) {
      if (!this.overlap(this._ball, paddle)) continue;
      if (paddle === this._paddleL)
        this._ball.center = {
          x: this._paddleL.right + this._ball.radius,
          y: this._ball.center.y,
        };
      if (paddle === this._paddleR)
        this._ball.center = {
          x: this._paddleR.left - this._ball.radius,
          y: this._ball.center.y,
        };
      //todo: cap the speed so the ball can't traverse the paddle
      this._ball.accelarate(1.1, 1);
      this._ball.bounce("horizontal");
    }

    const width = this._gameField.width;
    if (this._ball.right <= 0 || this._ball.left >= width) {
      const nextPlayer = this._playersQueue.shift() || null;
      if (this._ball.right <= 0) this._playerL = nextPlayer;
      if (this._ball.left >= width) this._playerR = nextPlayer;
      if (!this._playerL)
        this._players.get(this._playerR as string)?.addPoint();
      if (!this._playerR)
        this._players.get(this._playerL as string)?.addPoint();
      this._players.forEach((player) => {
        player.input = null;
      });
      if (!this._playerL || !this._playerR) this.resetQueue();
      this.resetObjects();
      this._sleep = 1 * this._fps;
    }
  }
}
