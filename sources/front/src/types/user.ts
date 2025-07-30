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

export type Configuration = {
  id: number;
  is2FA: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  verify?: boolean;
  configuration?: Configuration;
};
