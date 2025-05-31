// src/utils/i18n.ts\
const LANG_KEY = "lang";


export function saveLang(lang: string): void {
  window.location.reload();
  localStorage.setItem(LANG_KEY, lang);
}

// Récupère le Lang
export function getLang(): string {
  return localStorage.getItem(LANG_KEY) || "en";
}
