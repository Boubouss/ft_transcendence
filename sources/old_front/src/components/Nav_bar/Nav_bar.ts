import { createCustomButton } from "@/components/Buttons/CustomButton";
import { navigateTo } from "@/router";
import { getToken } from "@utils/authStorage.ts";
import { t } from "@utils/i18n.ts";
import * as authStorage from "@utils/authStorage"

export function renderNavBar() {
  const app = document.createElement("div");

  app.innerHTML = `
    <div id="button-container" class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6"></div>
  `;

  const buttonContainer = app.querySelector("#button-container")!;

  const commonButtonOptions = {
    width: "280px",
    height: "93px",
    textColor: "text-black",
    borderWidth: "border-2",
    borderRadius: "rounded-[20px]",
    fontStyle: "font-jaro font-semibold",
    fontSizeClass: "text-5xl",
  };

  const local_button = createCustomButton({
    ...commonButtonOptions,
    text: t("local"),
  });

  const multiplayer_button = createCustomButton({
    ...commonButtonOptions,
    text: t("multiplayer"),
    onClick: () => {
      if (authStorage.getToken())
        navigateTo("/multi");
    },
  });



  const career_button = createCustomButton({
    ...commonButtonOptions,
    text: t("career"),
    onClick: () => {
      if (authStorage.getToken())
          navigateTo("/");
    }
  });

    if (!getToken()) {
    multiplayer_button.style.filter = "brightness(0.6)";
    career_button.style.filter = "brightness(0.6)";

  }
    buttonContainer.appendChild(local_button);
  buttonContainer.appendChild(multiplayer_button);
  buttonContainer.appendChild(career_button);

  return app;  // retourne l'élément, c’est important !
}
