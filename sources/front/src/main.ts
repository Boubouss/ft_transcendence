// src/main.ts

import "./assets/styles/style.css"; // importe les styles
import { renderAccount } from "./pages/Account/AccountModalSystem.ts";
import { renderHome } from "./pages/Home/Home.ts"; // importe la fonction depuis home.ts
import { navigateTo } from "./router.ts";
import { initI18n } from "./utils/i18n";
import * as langStorage from "./utils/langStorage.ts";
import dotenv from "dotenv";

async function main() {
  if (!langStorage.getLang()) {
    langStorage.saveLang("fr");
  }

  await initI18n(); // <-- initialise la langue et les traductions
  navigateTo("home");
  dotenv.config();
}

export function changeRoute(page: string) {
  history.pushState({ page }, "", `/${page}`);
  navigateTo(page);
}

window.addEventListener("popstate", (event) => {
  const page = (event.state as any)?.page ?? "home";
  navigateTo(page);
});

//document.body.addEventListener("click", (e) => {
//  const a = (e.target as HTMLElement).closest("a");sign
//  if (a && a.origin === location.origin) {
//    e.preventDefault();
//    const href = a.getAttribute("href")?.slice(1) ?? "home";
//    changeRoute(href);
//  }
//});

window.addEventListener("load", () => {
  const path = window.location.pathname.slice(1) || "home";
  history.replaceState({ page: path }, "", window.location.pathname);
  navigateTo(path);
});

main();
