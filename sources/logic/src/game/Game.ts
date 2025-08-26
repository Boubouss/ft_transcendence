import { Ball } from "./Ball";
import { CreateGameRequestBody } from "../type/Interface";
import { GameField } from "./GameField";
import { GameState } from "../type/Enum";
import { Paddle } from "./Paddle";
import { Player } from "./Player";
import { MessageTypes } from "../type/Schema";
import * as other from "./other";
import { gameTimeout } from "..";

//offset from the center of the object
const PADDLE_OFFSET: number = 30;
const BALL_SPEED_MIN: number = 10;
const BALL_SPEED_MAX: number = 20;
const BALL_SPEED_RATIO: number = 1.05;

export class Game {
  private _gameId: string;
  private _players: Map<string, Player> = new Map();
  private _winnerId: number;

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
    config.playersId.forEach((id: string) => {
      this._players.set(id, new Player(id));
    });
    this._winnerId = -1;

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
  public get winnerId() {
    return this._winnerId;
  }
  public get players() {
    return this._players;
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
    this._ball.velocity = { dx: 0, dy: 0 };
  }
  private resetQueue() {
    this._playersQueue = Array(...this._players.keys());
    if (this._players.size !== 2) other.shuffle(this._playersQueue);
    this._playerL = this._playersQueue.shift() as string;
    this._playerR = this._playersQueue.shift() as string;
  }
  public setWinnerId(id: number) {
    this._winnerId = id;
  }
  public setGameState(state: GameState) {
    this._gameState = state;
  }
  public setPlayerConnection(id: string, socket: WebSocket | null) {
    const player = this._players.get(id);
    if (player !== undefined) player.socket = socket;
  }
  public setPlayerPause(id: string, value: MessageTypes["pause"]["value"]) {
    const player = this._players.get(id);
    if (!player) return;
    player.pause = value;
  }
  public setPlayerInput(id: string, input: MessageTypes["input"]["value"]) {
    const player = this._players.get(id);
    if (!player) return;
    player.input = input;
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
      state: GameState[this._gameState].toLowerCase(),
      sleep: this._sleep,
      players: [...this.players.entries()].map(
        ([key, value]: [string, Player]) => {
          return [key, value.toJson()];
        },
      ),
      queue: this._playersQueue,
      field: this._gameField.toJson(),
      playerL: this._playerL,
      playerR: this._playerR,
      paddleL: this._paddleL.toJson(),
      paddleR: this._paddleR.toJson(),
      ball: this._ball.toJson(),
    };
  }
  public update() {
    //todo: websocket could set to false onclose and we recheck only if false
    const gameFull = ![...this._players.values()].some((p) => !p.isConnected());
    const pausedPlayers = [...this._players.values()].some((p) => p.pause);
    if (this._gameState == GameState.Init && gameFull) {
      clearTimeout(gameTimeout.get(this._gameId));
      gameTimeout.delete(this._gameId);
      this._sleep = 2 * this._fps;
      this._gameState = GameState.Running;
    } else if (this._gameState == GameState.Running) {
      if (pausedPlayers) this._gameState = GameState.Paused;
    } else if (this._gameState == GameState.Paused) {
      if (gameFull && !pausedPlayers) {
        this._sleep = 2 * this._fps;
        this._gameState = GameState.Running;
      }
    }

    const winners = [...this._players.entries()].filter(
      ([_, p]) => p.point >= this._maxScore,
    );

    if (winners.length !== 0) {
      this._winnerId = parseInt(winners[0][1].id);
    }

    if (this.winnerId !== -1) {
      this._gameState = GameState.Over;
      return;
    }

    if (this._gameState != GameState.Running) return;
    if (this._sleep > 0) return this._sleep--;

    if (this._ball.isStatic()) {
      const angleMax = 5;
      const angleDeg = Math.random() * angleMax * 2 - angleMax;
      const angleRad = (angleDeg * Math.PI) / 180;
      const direction = Math.random() < 0.5 ? 1 : -1;
      this._ball.velocity = {
        dx: Math.cos(angleRad) * BALL_SPEED_MIN * direction,
        dy: Math.sin(angleRad) * BALL_SPEED_MIN,
      };
    }

    const pairPlayerPaddle = [
      [this._playerL, this._paddleL],
      [this._playerR, this._paddleR],
    ] as [string, Paddle][];

    for (const [id, paddle] of pairPlayerPaddle) {
      let player, input;
      if (!(player = this._players.get(id))) continue;
      if (!(input = player.input)) continue;
      if (input === null) continue;
      let step = 0;
      if (input === "up") {
        const toBorder = Math.abs(0 - paddle.top);
        step = Math.min(toBorder, paddle.step) * -1;
      }
      if (input === "down") {
        const toBorder = Math.abs(this._gameField.height - paddle.bottom);
        step = Math.min(toBorder, paddle.step);
      }
      const current = this._ball.center;
      paddle.center = { y: paddle.center.y + step };
      if (this.overlap(this._ball, paddle)) {
        const pX = Math.max(paddle.left, Math.min(current.x, paddle.right));
        const pY = Math.max(paddle.top, Math.min(current.y, paddle.bottom));
        const dX = this._ball.center.x - pX;
        const dY = this._ball.center.y - pY;
        if (Math.abs(dY) < Math.abs(dX)) continue;
        if (input === "up" && this._ball.center.y < paddle.center.y)
          paddle.top = this._ball.bottom;
        if (input === "down" && this._ball.center.y > paddle.center.y)
          paddle.bottom = this._ball.top;
      }
    }

    const start = this._ball.center;
    this._ball.center = {
      x: start.x + this._ball.velocity.dx,
      y: start.y + this._ball.velocity.dy,
    };
    const crossedLeft = this._ball.left <= this._paddleL.right;
    const crossedRight = this._paddleR.left <= this._ball.right;
    if (crossedLeft || crossedRight) {
      const speed = Math.hypot(this._ball.velocity.dx, this._ball.velocity.dy);
      const paddle = crossedLeft ? this._paddleL : this._paddleR;
      const steps = 10; //todo: could be dynamic
      const stepX = this._ball.velocity.dx / steps;
      const stepY = this._ball.velocity.dy / steps;
      for (let step = 1; step <= steps; step++) {
        this._ball.center = {
          x: start.x + stepX * step,
          y: start.y + stepY * step,
        };
        const current = this._ball.center;
        if (this.overlap(this._ball, paddle)) {
          const pX = Math.max(paddle.left, Math.min(current.x, paddle.right));
          const pY = Math.max(paddle.top, Math.min(current.y, paddle.bottom));
          const dX = current.x - pX;
          const dY = current.y - pY;

          if (Math.abs(dY) > Math.abs(dX)) {
            if (current.y < paddle.center.y) this._ball.bottom = paddle.top;
            else this._ball.top = paddle.bottom;
          } else if (Math.abs(dX) >= Math.abs(dY)) {
            if (crossedLeft && current.x < paddle.center.x) continue;
            if (!crossedLeft && current.x > paddle.center.x) continue;
            if (crossedLeft) this._ball.left = paddle.right;
            else this._ball.right = paddle.left;
          }
          const relativeY = current.y - paddle.center.y;
          const normalized = relativeY / (paddle.height / 2);
          const maxBounceAngle = (60 * Math.PI) / 180;
          const bounceAngle = normalized * maxBounceAngle;
          const direction = crossedLeft ? 1 : -1;
          const maxSpeed = Math.min(speed * BALL_SPEED_RATIO, BALL_SPEED_MAX);
          this._ball.velocity = {
            dx: Math.cos(bounceAngle) * maxSpeed * direction,
            dy: Math.sin(bounceAngle) * maxSpeed,
          };
          break;
        }
      }
    }

    const outB = this._ball.bottom >= this._gameField.height;
    const outT = this._ball.top <= 0;
    if (outT || outB) this._ball.velocity = { dy: this._ball.velocity.dy * -1 };
    if (outT) this._ball.top = 0;
    if (outB) this._ball.bottom = this._gameField.height;

    const outL = this._ball.right <= 0;
    const outR = this._ball.left >= this._gameField.width;
    if (outL || outR) {
      const nextPlayer = this._playersQueue.shift() || null;
      if (outL) this._playerL = nextPlayer;
      if (outR) this._playerR = nextPlayer;
      if (outL && this._playerR) this._players.get(this._playerR)?.addPoint();
      if (outR && this._playerL) this._players.get(this._playerL)?.addPoint();
      this._players.forEach((player) => (player.input = null));
      if (!this._playerL || !this._playerR) this.resetQueue();
      this.resetObjects();
      this._sleep = 2 * this._fps;
    }
  }
}
