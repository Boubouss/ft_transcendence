export interface CreateGameRequestBody {
  gameId: string;
  playersId: { [key: number]: string };
}

export enum GameState {
  Init,
  Paused,
  Running,
}

class GameField {
  private h: number;
  private w: number;

  constructor(h: number = 600, w: number = 800) {
    this.h = h;
    this.w = w;
  }
  getHeight() {
    return this.h;
  }
  getWidth() {
    return this.w;
  }
}

class Paddle {
  private x: number;
  private y: number;
  private h: number;
  private w: number;
  private dx: number;
  private dy: number;

  constructor(x: number, y: number, h: number = 80, w: number = 10) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.dx = 0;
    this.dy = 0;
  }
}

class Ball {
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
}

export class Game {
  private gameState: GameState = GameState.Init;
  private playersExpected: Set<string>;
  private playersConnected: Set<string> = new Set();
  private gameId: string;

  private gameField: GameField;
  private paddleL: Paddle;
  private paddleR: Paddle;
  private ball: Ball;

  constructor(config: CreateGameRequestBody) {
    this.gameId = config.gameId;
    this.playersExpected = new Set(Object.values(config.playersId));

    this.gameField = new GameField();
    const h: number = this.gameField.getHeight();
    const w: number = this.gameField.getWidth();
    this.paddleL = new Paddle(20, h / 2);
    this.paddleR = new Paddle(h - 20, h / 2);
    this.ball = new Ball(w / 2, h / 2);
  }
  getPlayersExpected() {
    return this.playersExpected;
  }
  getPlayersConnected() {
    return this.playersConnected;
  }
  setGameState(state: GameState) {
    this.gameState = state;
  }
  addPlayer(player: string) {
    this.playersConnected.add(player);
  }
  delPlayer(player: string) {
    this.playersConnected.delete(player);
  }
  update() {
    const full =
      this.playersConnected.size === this.playersExpected.size &&
      [...this.playersConnected].every((id) => this.playersExpected.has(id));

    if (this.gameState == GameState.Init && full) {
      console.log(`Game: ${this.gameId} starting`);
      this.gameState = GameState.Running;
    } else if (this.gameState == GameState.Running && !full) {
      console.log(`Game: ${this.gameId} paused`);
      this.gameState = GameState.Paused;
    } else if (this.gameState == GameState.Paused && full) {
      console.log(`Game: ${this.gameId} resuming`);
      this.gameState = GameState.Running;
    }
  }
}
