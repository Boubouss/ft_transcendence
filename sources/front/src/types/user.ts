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

export type User = {
  id: number | FormDataEntryValue | null;
  name?: string | FormDataEntryValue | null;
  email?: string | FormDataEntryValue | null;
  verify?: boolean;
  avatar?: string | FormDataEntryValue | null | HTMLInputElement;
  password?: string | FormDataEntryValue | null;
  configuration: Configuration;
  conf: Configuration;
};

export type Configuration = {
  is2FA: boolean;
};

export type ConfTrans = {
  id?: number;
  lang: string;
  token?: string;
};

export type UserEditForm = {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string | FormDataEntryValue | null | HTMLInputElement;
  configuration: Configuration;
};
