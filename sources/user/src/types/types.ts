export type User = {
	id: number;
	name: string;
	email: string;
	avatar: string;
	token: string;
	friends: User[];
	friendRequests: User[];
};
