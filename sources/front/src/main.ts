// src/main.ts

import "./assets/styles/style.css"; // importe les styles
import { renderAccount } from "./pages/Account/AccountModalSystem.ts";
import { renderHome } from "./pages/Home/Home.ts"; // importe la fonction depuis home.ts
import { initI18n } from "./utils/i18n";
import * as langStorage from "./utils/langStorage.ts";

async function main() {

  if (!langStorage.getLang()) {
    langStorage.saveLang("en");
  }

  await initI18n(); // <-- initialise la langue et les traductions
  renderHome();
}

main();
