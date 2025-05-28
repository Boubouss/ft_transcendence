// authStorage.ts

type User = Record<string, any>;

const USER_KEY = "user";
const TOKEN_KEY = "token";
const A2F_KEY = "a2f"; // Clé pour le stockage de l'état de l'authentification à deux facteurs

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

// Met à jour une valeur spécifique dans le user via sa clé
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

// Sauvegarde l'état de l'authentification à deux facteurs
export function setA2F(value: boolean): void {
  localStorage.setItem(A2F_KEY, JSON.stringify(value));
}

// Récupère l'état de l'authentification à deux facteurs
export function getA2F(): boolean | null {
  const a2f = localStorage.getItem(A2F_KEY);
  return a2f ? JSON.parse(a2f) : null;
}

// Supprime les infos d'authentification
export function clearAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  //localStorage.removeItem(A2F_KEY); // Supprime également l'état de l'authentification à deux facteurs
}
