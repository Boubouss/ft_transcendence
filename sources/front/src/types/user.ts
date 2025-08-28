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
  id: number;
  name: string;
  email: string;
  avatar: string;
  password?: string;
  configuration: Configuration;
};

export type UserForm = {
  id: FormDataEntryValue | null;
  name?: FormDataEntryValue | null;
  email?: FormDataEntryValue | null;
  verify?: boolean;
  avatar?: FormDataEntryValue | null | HTMLInputElement;
  password?: FormDataEntryValue | null;
  configuration: Configuration;
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
