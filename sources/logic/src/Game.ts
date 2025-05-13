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
  private socket: WebSocket | null;
  private input: "up" | "down" | null;
  constructor(playerId: string) {
    this.playerId = playerId;
    this.score = 0;
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
  public setInput(input: "up" | "down" | null) {
    this.input = input;
  }
  public toJSON() {
    return { playerId: this.playerId, score: this.score, input: this.input };
  }
}

class GameField {
  private h: number;
  private w: number;

  constructor(h: number = 600, w: number = 800) {
    this.h = h;
    this.w = w;
  }
  public getHeight() {
    return this.h;
  }
  public getWidth() {
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
  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public toJSON() {
    return { x: this.x, y: this.y, h: this.h, w: this.w };
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
  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public setVelocity(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
  public toJSON() {
    return {
      x: this.x,
      y: this.y,
      r: this.r,
      dx: this.dx,
      dy: this.dy,
    };
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
