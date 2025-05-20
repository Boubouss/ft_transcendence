// src/home.ts
import { renderNavBar } from "@components/Nav_bar/Nav_bar.ts";
import * as HM from "@pages/Home/Home-mobile.ts";
import { createLangDropdown } from "@/components/Buttons/LangButton";
import { getSignButtonOptions } from "@/components/Buttons/LoginButton";
import { createCustomButton } from "@/components/Buttons/CustomButton";

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

  // === Lang Dropdown (visible seulement sur sm et +) ===

  app.appendChild(createLangDropdown());

  // === Sign In / Account Button (visible seulement sur sm et +) ===

  const SignButtonOptions = getSignButtonOptions();
  const SignButton = createCustomButton({
    ...SignButtonOptions,
  });

  app.appendChild(SignButton);

  // === Navbar ===
  app.appendChild(renderNavBar());

  // === Ajouter à la page ===
  appRoot.appendChild(app);
  let size: number = 640;
    let resizeTimeout: NodeJS.Timeout;
  let currentIsMobile = window.innerWidth < size;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobileNow = window.innerWidth < size;
      if (isMobileNow !== currentIsMobile) {
        currentIsMobile = isMobileNow;
          window.location.reload();
      }
    }, 200); // 200ms après le dernier resize
  });


}
