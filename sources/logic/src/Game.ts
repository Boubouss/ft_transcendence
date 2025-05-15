export interface CreateGameRequestBody {
  gameId: string;
  playersId: string[];
}

export enum GameState {
  Init,
  Paused,
  Running,
}

class Player {
  private playerId: string;
  private score: number;
  private connected: boolean;
  constructor(playerId: string) {
    this.playerId = playerId;
    this.score = 0;
    this.connected = false;
  }
  isConnected() {
    return this.connected;
  }
  getId() {
    return this.playerId;
  }
  setConnected(bool: boolean) {
    this.connected = bool;
  }
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
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
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
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  setVelocity(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
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

  getPlayersId() {
    return new Set(this.players.keys());
  }
  getPlayersConnected() {
    return new Set(
      [...this.players.entries()]
        .filter(([_, player]) => player.isConnected())
        .map(([id, _]) => id),
    );
  }
  setGameState(state: GameState) {
    this.gameState = state;
  }
  setPlayerConnection(playerId: string, bool: boolean) {
    this.players.get(playerId)?.setConnected(bool);
  }
  handleGameState() {
    const full = [...this.players.values()].every((player) =>
      player.isConnected(),
    );

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
  update() {
    this.handleGameState();
    if (this.gameState != GameState.Running) return;
  }
}
