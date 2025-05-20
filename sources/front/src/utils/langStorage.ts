// src/utils/i18n.ts\
const LANG_KEY = "lang";


export function saveLang(lang: string): void {
  localStorage.setItem(LANG_KEY, lang);
  window.location.reload();
}

// Récupère le Lang
export function getLang(): string {
  return localStorage.getItem(LANG_KEY) || "en";
}
