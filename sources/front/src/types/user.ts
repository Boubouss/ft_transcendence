export type Friend = {
	id: number;
	name: string;
	avatar: string;
};

export type Friendship = {
	online: Friend[];
	offline: Friend[];
	requests: Friend[];
	sent: Friend[];
};
