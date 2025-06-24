// src/home.ts
import { renderNavBar } from "@components/Nav_bar/Nav_bar.ts";
import * as HM from "@components/Buttons/mobileMenuButton";
import { createLangDropdown } from "@/components/Buttons/LangButton";
import { getSignButtonOptions } from "@/components/Buttons/LoginButton";
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { createLogoutButton } from "@/components/Buttons/AccountButtons";

export function renderHome() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = "";

  const app = document.createElement("div");
  app.className = "relative h-screen w-screen overflow-hidden";

  // === Fond d'écran ===
  const background = document.createElement("div");
  background.className = `
  absolute inset-0 -z-10
  bg-[url('/assets/images/main-menu_background.jpg')]
  bg-cover bg-center
  sm:bg-[length:110%_160%]
  bg-[length:150%_180%]
`;

  app.appendChild(background);

  app.appendChild(HM.mobileMenuButton);

  app.appendChild(createLangDropdown());

  const ButtonContainerRight = document.createElement("div");
  ButtonContainerRight.className = `
  absolute
  right-12
  top-10
  flex
  flex-col
  items-center
  gap-4
  `;

  const SignButtonOptions = getSignButtonOptions();
  const SignButton = createCustomButton({
    ...SignButtonOptions,
    position: "hidden sm:block min-h-[80px]",

  });

  const LogoutButton = createLogoutButton(null, true);

  ButtonContainerRight.appendChild(SignButton);

  ButtonContainerRight.appendChild(LogoutButton);

  app.appendChild(ButtonContainerRight);
  app.appendChild(renderNavBar());

  appRoot.appendChild(app);


}
