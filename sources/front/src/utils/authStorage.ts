// authStorage.ts

type User = Record<string, any>;

const USER_KEY = "user";
const TOKEN_KEY = "token";

// Sauvegarde l'objet utilisateur complet
export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Récupère l'objet utilisateur complet
export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Récupère une valeur spécifique dans le user via sa clé
export function getUserValue<T = any>(key: string): T | null {
  const user = getUser();
  return user && key in user ? user[key] as T : null;
}

export function setUserValue<T = any>(key: string, value: T): void {
  const user = getUser();
  if (user) {
    user[key] = value;
    saveUser(user);
  }
}

// Sauvegarde le token
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Récupère le token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Supprime les infos d'authentification
export function clearAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
