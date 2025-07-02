// authStorage.ts

export type Configuration_T = {
  id: number;
  is2FA: boolean;
};

export type User_T = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  token: string;
  configuration?: Configuration_T;
};

type User = User_T;

const USER_KEY = "user";
const TOKEN_KEY = "token";
const OLD_2FA_KEY = "Old2FA";

// Sauvegarde l'objet utilisateur complet
export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Récupère l'objet utilisateur complet
export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
}

// Récupère une valeur spécifique dans le user via sa clé
// Récupère une valeur spécifique dans le user via sa clé
export function getUserValue<K extends keyof User>(key: K): User[K] | null {
  const user = getUser();
  return user && key in user ? user[key] : null;
}

// Met à jour une valeur spécifique dans le user via sa clé
export function setUserValue<K extends keyof User>(key: K, value: User[K]): void {
  const user = getUser();
  if (user) {
    user[key] = value;
    saveUser(user);
  }
}

// Supprime une propriété spécifique de l'utilisateur
export function deleteUserValue<K extends keyof User>(key: K): void {
  const user = getUser();
  if (user && key in user) {
    delete user[key];
    saveUser(user);
  }
}


// Sauvegarde le token
export function saveToken(token: string): void {
  setUserValue("token", token);
}

// Récupère le token
export function getToken(): string | null {
  return getUserValue("token");
}

// Accès à la configuration
export function getConfiguration(): Configuration_T | null {
  const user = getUser();
  return user?.configuration ?? null;
}

export function setConfiguration(newConfig: Configuration_T): void {
  const user = getUser();
  if (!user) return;

  user.configuration = newConfig;
  saveUser(user);
}


// Récupère la valeur de is2FA depuis la configuration
export function getA2FfromConfig(): boolean | null {
  const config = getConfiguration();
  return typeof config?.is2FA === "boolean" ? config.is2FA : null;
}

// Modifie is2FA dans la configuration
export function setA2FInConfig(value: boolean): void {
  const user = getUser();
  const config = getConfiguration();

  if (!user || !config) return;

  config.is2FA = value;

  setConfiguration(config);
  //saveUser(user);
}


// Supprime les infos d'authentification
export function clearAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}


// Sauvegarde l'ancien état du 2FA
export function saveOld2fa(old2FA: boolean | null): void {
  localStorage.setItem(OLD_2FA_KEY, JSON.stringify(old2FA));
}

// Récupère l'ancien état du 2FA
export function getOld2fa(): boolean | null {
  const stored = localStorage.getItem(OLD_2FA_KEY);
  return stored !== null ? JSON.parse(stored) : null;
}

// Supprime l'ancien 2FA
export function clearOld2fa(): void {
  localStorage.removeItem(OLD_2FA_KEY);
}

// Compare l'ancien et le 2FA actuel
// Renvoie old2FA s'ils sont différents, sinon le 2FA actuel
export function getSignificant2FA(): void {
  const current2FA = getA2FfromConfig();
  const old2FA = getOld2fa();
  clearOld2fa();
  if (old2FA === null && current2FA != null) {
    setA2FInConfig(current2FA);
  } else if (old2FA === current2FA) {
    return ;
  } else {
    if (old2FA !== null)
      setA2FInConfig(old2FA);
  }
}
