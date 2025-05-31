// src/home.ts
import { renderNavBar } from "@components/Nav_bar/Nav_bar.ts";
import { createCustomButton } from "@components/Buttons/CustomButton.ts";
import * as authStorage from "@utils/authStorage";
import { navigateTo } from "@/router.ts";
import { t } from "@utils/i18n.ts";
import * as langStorage from "@utils/langStorage.ts";

export function renderHome() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = ""; // vide le contenu avant

  const app = document.createElement("div");
  app.className = "relative h-screen w-screen";

  // Fond d'écran
  const background = document.createElement("div");
  background.className =
    "bg-[url('../../assets/images/main-menu_background.jpg')] h-full w-full bg-cover bg-center";
  background.style.backgroundSize = "110% 160%";
  app.appendChild(background);

  let signButton: HTMLElement;

  // === 1. Bouton déroulant de langue ===
  const langContainer = document.createElement("div");
  langContainer.className = "absolute top-10 left-10";

  const langButton = createCustomButton({
    text: langStorage.getLang().toUpperCase() || "es", // e.g., "FR"
    textColor: "text-white",
    fontStyle: "font-jaro font-semibold",
    fontSizeClass: "text-4xl",
    width: "120px",
    height: "80px",
    position: "",
  });

  const dropdown = document.createElement("div");
  dropdown.className =
    "hidden absolute mt-4 w-[120px] bg-white rounded-[20px] shadow-md z-50";
  dropdown.style.top = "70px";

  const languages = ["fr", "en", "es"];
  languages.forEach((lang, index) => {
    const langOption = document.createElement("div");
    langOption.className =
      "px-4 py-2 text-black cursor-pointer text-center hover:bg-gray-200";

    if (index === 0) langOption.classList.add("rounded-t-[20px]");
    if (index === languages.length - 1)
      langOption.classList.add("rounded-b-[20px]");

    langOption.textContent = lang.toUpperCase();
    langOption.addEventListener("click", () => {
      langStorage.saveLang(lang);
    });
    dropdown.appendChild(langOption);
  });

  // Toggle menu
  langButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  langContainer.appendChild(langButton);
  langContainer.appendChild(dropdown);
  app.appendChild(langContainer);

  // Bouton "Sign In / Sign Up"
  if (!authStorage.getToken()) {
    signButton = createCustomButton({
      text: t("signin") + " / " + t("signup"),
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "220px",
      height: "80px",
      position: "absolute top-10 right-10",
      onClick: () => navigateTo("sign"),
    });
  } else {
    signButton = createCustomButton({
      text: authStorage.getUserValue("username") ?? t("myacc"),
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "",
      height: "80px",
      padding: "p-[10px]",
      position: "absolute top-10 right-10",
      onClick: () => navigateTo("account"),
    });
  }
  app.appendChild(signButton);

  // Ajoute navbar au dessus du contenu
  app.appendChild(renderNavBar());

  appRoot.appendChild(app);
}
