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

//// Sauvegarder l'URL actuelle avant le rechargement
//window.addEventListener('beforeunload', () => {
//  // Enlève le premier '/' du pathname avant de stocker
//  const pathSansSlash = window.location.pathname.startsWith('/')
//    ? window.location.pathname.slice(1)
//    : window.location.pathname;

//  localStorage.setItem('lastVisitedPage', pathSansSlash);
//});


//// Restaurer l'URL après le rechargement
//window.addEventListener('load', () => {
//  const lastVisitedPage = localStorage.getItem('lastVisitedPage');
//  if (lastVisitedPage) {
//    changeRoute(lastVisitedPage);
//  } else {
//    changeRoute('home'); // Par défaut, rediriger vers la page d'accueil
//  }
//});




