import { renderHome } from './pages/Home/Home.ts';
import { renderSignModal } from './pages/Sign/Sign.ts';
import { renderAccount as renderModalAccount } from './pages/Account/AccountModalSystem.ts';
import { renderMultiPage } from './pages/Multiplayer/MultiPage.ts';
import { renderOneVOne } from './pages/Local/OneVOne.ts';
import { connect } from './pages/Local/OnevOneSystem.ts';
import { create_game } from './pages/Local/utils.ts';
import { renderModalLocal } from './pages/Local/LocalModal.ts';

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
      renderModalAccount(); // ← ouvre la modal des paramètres
      break;
    case "multi":
      renderMultiPage();
      break;
    case "1v1":
      renderOneVOne();
      connect();
      break;
    case "local":
      renderModalLocal();
      break
    default:
      appRoot.innerHTML = "<p class='text-center text-red-600 mt-10'>404 - Page Not Found</p>";
  }
}

