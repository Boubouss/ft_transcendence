// src/utils/i18n.ts
import * as langStorage from './langStorage';

type Translations = Record<string, string>;

let translations: Translations = {};

// Charge un fichier JSON de traduction selon la langue
async function loadTranslations(lang: string): Promise<void> {
  try {
    const response = await fetch(`/langs/${lang}.json`);
    if (!response.ok) throw new Error(`Cannot load ${lang}.json`);
    translations = await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    translations = {}; // fallback vide
  }
}

// Change la langue et sauvegarde dans le localStorage
export async function setLang(lang: string): Promise<void> {
  langStorage.saveLang(lang);                // ✅ utilise ta fonction
  await loadTranslations(lang);
  updatePageTexts();            // met à jour les textes si présents
}

// Initialise la langue automatiquement
export async function initI18n(): Promise<void> {
  const lang = langStorage.getLang() || 'fr'; // ✅ utilise ta fonction
  await loadTranslations(lang);
  updatePageTexts();
}

// Fonction de traduction
export function t(key: string): string {
  return translations[key] || key;
}

// Met à jour automatiquement tous les éléments avec l’attribut [data-i18n]
export function updatePageTexts(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.innerText = t(key);
    }
  });
}
