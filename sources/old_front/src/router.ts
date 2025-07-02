import { renderHome } from './pages/Home/Home.ts';
import { renderSignModal } from './pages/Sign/Sign.ts';
import { renderAccount } from './pages/Account/AccountModalSystem.ts';
import { renderMultiPage } from './pages/Multiplayer/MultiPage.ts';

window.addEventListener('popstate', () => render(window.location.pathname));

export function navigateTo(path: string) {
  console.log(path);
  window.history.pushState({}, "", path);
  render(path);
}

export function render(path: string) {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = "";

  switch (path) {
    case "/":
      return renderHome();
    case "/sign":
      return renderSignModal();
    case "/account":
      return renderAccount();
    case "/multi":
      return renderMultiPage();
    default:
      appRoot.innerHTML = "<p class='text-center text-red-600 mt-10'>404 - Page Not Found</p>";
  }
}
