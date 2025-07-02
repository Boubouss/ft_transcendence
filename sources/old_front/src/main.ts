import * as langStorage from "./utils/langStorage.ts";
import { initI18n } from "./utils/i18n";
import { render } from "./router.ts";
import "./index.css";

async function main() {
  if (!langStorage.getLang()) {
    langStorage.saveLang("fr");
  }

  await initI18n();

  render("/");
}

main();
