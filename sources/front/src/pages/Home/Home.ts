// src/home.ts
import { renderNavBar } from '../../components/Nav_bar/Nav_bar.ts';
import { createCustomButton } from "../../components/Buttons/CustomButton.ts";
import * as authStorage from '../../utils/authStorage';
import { navigateTo } from '../../router.ts';

export function renderHome() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = ""; // vide le contenu avant

  const app = document.createElement('div');
  app.className = "relative h-screen w-screen";

  // Fond d'écran
  const background = document.createElement('div');
  background.className = "bg-[url('/assets/images/main-menu_background.jpg')] h-full w-full bg-cover bg-center";
  background.style.backgroundSize = "110% 160%";
  app.appendChild(background);

  let signButton: HTMLElement;

  // Bouton "Sign In / Sign Up"
  if (!authStorage.getToken()) {
    signButton = createCustomButton({
      text: "Sign In / Sign Up",
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "220px",
      height: "80px",
      position: "absolute top-10 right-10",
      onClick: () => navigateTo("sign"),
    });
  }
  else {
    signButton = createCustomButton({
      text: authStorage.getUserValue("username") ?? "Mon Compte",
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


