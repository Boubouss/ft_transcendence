import { Ball } from "./Ball";
import { CreateGameRequestBody } from "../type/Interface";
import { GameField } from "./GameField";
import { GameState } from "../type/Enum";
import { Paddle } from "./Paddle";
import { Player } from "./Player";
import { PlayerInput } from "../type/Type";
import * as other from "./other";

export class Game {
  private gameId: string;
  private players: Map<string, Player> = new Map();

  private gameField: GameField;
  private paddleL: Paddle;
  private paddleR: Paddle;
  private ball: Ball;

  private gameState: GameState = GameState.Init;
  private playersQueue: Array<string>;
  private playerL: string | null;
  private playerR: string | null;

  constructor(config: CreateGameRequestBody) {
    this.gameId = config.gameId;
    config.playersId.forEach((playerId: string) => {
      this.players.set(playerId, new Player(playerId));
    });

    this.playersQueue = Array(...this.players.keys());
    other.shuffle(this.playersQueue);
    this.playerL = this.playersQueue.shift() as string;
    this.playerR = this.playersQueue.shift() as string;

    this.gameField = new GameField();
    const h: number = this.gameField.getHeight();
    const w: number = this.gameField.getWidth();
    //todo: remove the overridden height
    this.paddleL = new Paddle(20 / 2, h / 2);
    this.paddleR = new Paddle(w - 20 / 2, h / 2);
    this.ball = new Ball(w / 2, h / 2);
  }
  private resetObjects() {
    other.shuffle(this.playersQueue);
    const h: number = this.gameField.getHeight();
    const w: number = this.gameField.getWidth();
    this.paddleL.setPosition(20, h / 2);
    this.paddleR.setPosition(w - 20, h / 2);
    this.ball.setPosition(w / 2, h / 2);
    this.ball.setVelocity(0, 0);
  }
  private resetQueue() {
    this.playersQueue = Array(...this.players.keys());
    other.shuffle(this.playersQueue);
    this.playerL = this.playersQueue.shift() as string;
    this.playerR = this.playersQueue.shift() as string;
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
  public setPlayerConnection(playerId: string, socket: WebSocket | null) {
    this.players.get(playerId)?.setConnected(socket);
  }
  public toJson() {
    return {
      gameId: this.gameId,
      state: GameState[this.gameState],
      players: [[...this.players.values()].map((player) => player.toJson())],
      queue: this.playersQueue,
      field: this.gameField.toJson(),
      playerL: this.playerL,
      playerR: this.playerR,
      paddleR: this.paddleR.toJson(),
      paddleL: this.paddleL.toJson(),
      ball: this.ball.toJson(),
    };
  }

  public setPlayerInput(playerId: string, input: PlayerInput) {
    this.players.get(playerId)?.setInput(input);
  }

  public broadcast(message: string) {
    this.players.forEach((player, _) => {
      if (player.isConnected()) player.getSocket()?.send(message);
    });
  }

  private overlap(ball: Ball, paddle: Paddle): boolean {
    const center = ball.center;
    const pX = Math.max(paddle.left, Math.min(center.x, paddle.right));
    const pY = Math.max(paddle.top, Math.min(center.y, paddle.bottom));
    const dist = Math.sqrt((center.x - pX) ** 2 + (center.y - pY) ** 2);
    return dist <= ball.radius;
  }

  public update() {
    //todo: websocket could set to false onclose and we recheck only if false
    const full = ![...this.players.values()].some((p) => !p.isConnected());

    if (this.gameState == GameState.Init && full) {
      this.gameState = GameState.Running;
    } else if (this.gameState == GameState.Running && !full) {
      this.gameState = GameState.Paused;
    } else if (this.gameState == GameState.Paused && full) {
      this.gameState = GameState.Running;
    }
    if (this.gameState != GameState.Running) return;

    //todo: replace with better values
    if (this.ball.isStatic()) {
      let dx = Math.ceil(Math.random() * 10);
      let dy = Math.ceil(Math.random() * 10);
      if (Math.floor(Math.random() * 2) % 2) dx *= -1;
      if (Math.floor(Math.random() * 2) % 2) dy *= -1;
      this.ball.setVelocity(dx, dy);
    }

    const pairPlayerPaddle = [
      [this.playerL, this.paddleL],
      [this.playerR, this.paddleR],
    ] as [string, Paddle][];

    for (const [playerId, paddle] of pairPlayerPaddle) {
      let player, input;
      if (!(player = this.players.get(playerId))) continue;
      if (!(input = player.getInput())) continue;
      paddle.move(input, 0, this.gameField.getHeight()); //todo: improve the bounce
      player.setInput(null);
    }

    this.ball.move();

    if (this.ball.top <= 0 || this.ball.bottom >= this.gameField.getHeight())
      this.ball.bounce("vertical");

    for (const [_, paddle] of pairPlayerPaddle) {
      if (!this.overlap(this.ball, paddle)) continue;
      const radius = this.ball.radius;
      if (paddle === this.paddleL)
        this.ball.setPosition(this.paddleL.right + radius, this.ball.center.y);
      if (paddle === this.paddleR)
        this.ball.setPosition(this.paddleR.left - radius, this.ball.center.y);
      this.ball.bounce("horizontal");
    }

    const width = this.gameField.getWidth();
    if (this.ball.left <= 0 || this.ball.right >= width) {
      const nextPlayer = this.playersQueue.shift() || null;
      if (this.ball.left <= 0) this.playerL = nextPlayer;
      if (this.ball.right >= width) this.playerR = nextPlayer;
      if (!this.playerL) this.players.get(this.playerR as string)?.addPoint();
      if (!this.playerR) this.players.get(this.playerL as string)?.addPoint();
      if (!this.playerL || !this.playerR) this.resetQueue();
      this.resetObjects();
    }
  }
}
