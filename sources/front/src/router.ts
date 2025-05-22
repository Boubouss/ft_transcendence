import { renderHome } from './pages/Home/Home.ts';
import { renderSign } from './pages/Sign/Sign.ts';

export function navigateTo(page: string) {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = ""; // vide le contenu à chaque navigation

  switch (page) {
    case "home":
      renderHome();
      break;
    case "sign":
      renderSign();
      break;
    default:
      appRoot.innerHTML = "<p class='text-center text-red-600 mt-10'>404 - Page Not Found</p>";
  }
}
