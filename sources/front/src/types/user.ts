export type User = {
  id: number | FormDataEntryValue | null;
  name?: string | FormDataEntryValue | null;
  email?: string | FormDataEntryValue | null;
  avatar?: string | FormDataEntryValue | null | HTMLInputElement;
  password?: string | FormDataEntryValue | null;
  configuration: Configuration;
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

export type UserEditForm = {
  id: number ;
  name?: string ;
  email?: string ;
  password?: string ;
  configuration: Configuration;
};
