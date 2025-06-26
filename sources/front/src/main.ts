// src/main.ts

import "./assets/styles/style.css"; // importe les styles
import { navigateTo } from "./router.ts";
import { changeRoute } from "./utils/events.ts";
import { initI18n } from "./utils/i18n";
import * as langStorage from "./utils/langStorage.ts";

async function main() {
  if (!langStorage.getLang()) {
    langStorage.saveLang("fr");
  }

  await initI18n(); // <-- initialise la langue et les traductions
  changeRoute("home");

}

main();
