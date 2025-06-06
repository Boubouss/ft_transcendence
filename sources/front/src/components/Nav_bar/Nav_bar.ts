import { createCustomButton } from "@/components/Buttons/CustomButton";
import { getToken } from "@utils/authStorage.ts";
import { t } from "@utils/i18n.ts";

export function renderNavBar() {
  const app = document.createElement("div");

  app.innerHTML = `
    <div id="button-container" class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6"></div>
  `;

  const buttonContainer = app.querySelector("#button-container")!;

  const commonButtonOptions = {
    backgroundColor: "bg-[#D6A01A]",
    width: "274px",
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
  });

  if (!getToken())
    multiplayer_button.style.filter = "brightness(0.6)";

  const quit_button = createCustomButton({
    ...commonButtonOptions,
    text: t("career"),
  });

  buttonContainer.appendChild(local_button);
  buttonContainer.appendChild(multiplayer_button);
  buttonContainer.appendChild(quit_button);

  return app;  // retourne l'élément, c’est important !
}
