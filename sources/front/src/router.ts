import { renderHome } from './pages/Home/Home.ts';
import { renderSignModal } from './pages/Sign/Sign.ts';
import { renderAccount } from './pages/Account/AccountModalSystem.ts';
import { renderMultiPage } from './pages/Multiplayer/MultiPage.ts';
import { renderOneVOne } from './pages/Local/OneVOne.ts';

export function navigateTo(page: string) {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = "";

  switch (page) {
    case "home":
      renderHome();
      break;
    case "sign":
      renderSignModal();
      break;
    case "account":
      renderAccount(); // ← ouvre la modal des paramètres
      break;
    case "multi":
      renderMultiPage();
      break;
    case "1v1":
      renderOneVOne();
      break;
    default:
      appRoot.innerHTML = "<p class='text-center text-red-600 mt-10'>404 - Page Not Found</p>";
  }
}

