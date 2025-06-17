import { navigateTo } from "@/router";
import * as authStorage from "@utils/authStorage.ts";
import { createCustomButton } from "@/components/Buttons/CustomButton"; // adapte le chemin si besoin
import { t } from "@utils/i18n";

function create2FAModal(validOrActivate: string, user: any): HTMLDivElement {
  const modal = document.createElement("div");
  modal.id = "twofa-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  const modalContent = document.createElement("div");
  modalContent.style.background = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.maxWidth = "320px";
  modalContent.style.width = "90%";
  modalContent.style.textAlign = "center";

  const title = document.createElement("h3");
  title.textContent = t("requireda2f");

  const input = document.createElement("input");
  input.id = "twofa-code";
  input.type = "text";
  input.maxLength = 6;
  input.placeholder = t("entera2f");
  input.style.width = "100%";
  input.style.margin = "15px 0";
  input.style.padding = "10px";
  input.style.fontSize = "16px";
  input.style.textAlign = "center";
  input.style.letterSpacing = "0.3em";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.flexDirection = "column";
  buttonsContainer.style.alignItems = "center";
  buttonsContainer.style.gap = "10px";

  const submitBtn = createCustomButton({
    text: t("valid"),
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    width: "75%",
    borderRadius: "rounded-[10px]",
    fontSizeClass: "text-base",
    onClick: () => {
      const code = input.value.trim();
      if (code !== "000000") {
        alert(t("alerta2f"));
        return;
      }
      document.body.removeChild(modal);
      if (validOrActivate == "EnableDisable") {
        // Activation / désactivation 2FA
        const A2FStatus = authStorage.getA2FfromConfig();
        authStorage.setA2FInConfig(!A2FStatus);
        if (authStorage.getA2FfromConfig()) {
          alert(t("a2fenable"))
        } else {
          alert(t("a2fdisable"))
        }
      } else {
        authStorage.saveUser(user);

        const token = authStorage.getUserValue("token");
        if (token)
          authStorage.saveToken(token);
          navigateTo("home");
      }
    },
  });

  const closeBtn = createCustomButton({
    text: t("cancel"),
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    width: "75%",
    borderRadius: "rounded-[10px]",
    fontSizeClass: "text-base",
    onClick: () => {
      const modal = document.querySelector("#twofa-modal");
      if (modal) document.body.removeChild(modal);
      if (validOrActivate == "Connexion")
        authStorage.clearAuth();
    },
  });

  buttonsContainer.appendChild(submitBtn);
  buttonsContainer.appendChild(closeBtn);

  modalContent.appendChild(title);
  modalContent.appendChild(input);
  modalContent.appendChild(buttonsContainer);
  modal.appendChild(modalContent);

  return modal;
}

function show2FAModal(validOrActivate: string, user: any = null) {
  const modal = create2FAModal(validOrActivate, user);
  document.body.appendChild(modal);
}

export function handlePostLogin(user: any, needs2FA: boolean) {
  if (!needs2FA) {
    navigateTo("home");
  } else {
    show2FAModal('Connexion', user); // validation mode
  }
}

export function EnableDisableA2F() {
  const user = authStorage.getUser();
  show2FAModal("EnableDisable", user); // activation mode
}
