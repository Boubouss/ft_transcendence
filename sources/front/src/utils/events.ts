import { navigateTo } from "@/router";

// 🌍 Intercepteur global : déclenche `locationchange` à chaque changement d'URL
(() => {
  const originalPush = history.pushState;
  history.pushState = function (...args) {
    const result = originalPush.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };
  const originalReplace = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplace.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };
  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"));
  });
})();

// 🧭 Navigation avec historique
export function changeRoute(page: string) {
  history.pushState({ page }, "", `/${page}`);
  navigateTo(page);
  // `locationchange` est émis automatiquement
}

// 🔄 Gérer le bouton Back/Forward du navigateur
window.addEventListener("popstate", (event) => {
  const page = (event.state as any)?.page ?? "home";
  navigateTo(page);
  // `locationchange` aussi déclenché via l’intercepteur
});

// 📥 Initialisation au chargement
window.addEventListener("load", () => {
  const path = window.location.pathname.slice(1) || "home";
  history.replaceState({ page: path }, "", window.location.pathname);
  navigateTo(path);
});


