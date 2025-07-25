export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  conf: Configuration;
};

type Configuration = {
  id: number;
  is2FA: boolean;
};

export type ConfTrans = {
  id?: number;
  lang: string;
  token?: string;
};
