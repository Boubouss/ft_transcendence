export type toJson_T = {
	gameId: string;
	state: string;
	players: player_T[] ;
	queue: string[];
	field: {h:number, w:number};
	playerL: string;
	playerR: string;
	paddleL: paddle_T;
	paddleR: paddle_T;
    ball: ball_T;
};


type paddle_T = {
    x: number;
    y: number;
    h:number;
    w:number;
};

type ball_T = {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
}

type player_T = {
    playerId: string;
    score: number;
    input: null | "up" | "down";
}
