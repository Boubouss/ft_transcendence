import { createCustomButton } from "@/components/Buttons/CustomButton";
import { t } from "@utils/i18n";
import * as authStorage from "@utils/authStorage";
import { navigateTo } from "@/router";
import { EnableDisableA2F } from "@/pages/Sign/A2F";
import { getSignButtonOptions } from "./LoginButton";

export function createCloseModalButton(onClick: () => void) {
  return createCustomButton({
    width: "60px",
    height: "60px",
    borderRadius: "rounded-[20px]",
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "45px",
    imageHeight: "45px",
    onClick,
  });
}

export function createEditInfoButton(onClick: () => void) {
  return createCustomButton({
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("editinfo"),
    fontSizeClass: "text-2xl",
    padding: "p-[10px]",
    onClick,
  });
}

export function createValidateEditButton(onClick: () => void) {
  return createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("valid"),
    onClick,
  });
}

export function createCancelEditButton(onClick: () => void) {
  return createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("cancel"),
    onClick,
  });
}

export function createA2FButton(onClick: () => void) {
  const isEnabled = authStorage.getA2FfromConfig();
  return createCustomButton({
    text: isEnabled ? t("offa2f") : t("ona2f"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: isEnabled ? "bg-red-500" : "bg-green-500",
    padding: "p-[10px]",
    onClick,
  });
}

export function createA2FToggle(): HTMLLabelElement {
  // Conteneur principal
  const wrapper = document.createElement("label");
  wrapper.className = "relative inline-block w-[120px] h-[60px]";

  // Checkbox cachée
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "peer sr-only";
  wrapper.appendChild(checkbox);

  if (authStorage.getA2FfromConfig()) checkbox.checked = true;

  // Fond du toggle (track)
  const track = document.createElement("div");
  track.className =
    "peer-checked:bg-green-600 bg-red-700 rounded-[20px] w-full h-full transition-colors duration-300 border-2";
  wrapper.appendChild(track);

  // Bouton glissant (thumb)
  const thumb = document.createElement("div");
  thumb.className =
    "absolute top-0 left-0 peer-checked:translate-x-[100%] w-[50%] h-[60px] bg-white rounded-[20px] transition-transform duration-300";
  wrapper.appendChild(thumb);

  // Label texte à l’intérieur du thumb
  const labelSpan = document.createElement("span");
  labelSpan.className =
    "absolute inset-0 flex items-center justify-center text-2xl font-jaro text-gray-800 peer-checked:text-white text-center bg-orange-400 border-2 rounded-[20px]";
  labelSpan.textContent = "A2F";
  thumb.appendChild(labelSpan);

  // Mettre à jour le libellé selon l’état
  checkbox.addEventListener("change", async () => {
    try {
      await EnableDisableA2F();

      // Une fois fini, on récupère le statut réel
      const isEnabled = authStorage.getA2FfromConfig();
      checkbox.checked = !!isEnabled;
    } catch (err) {
      console.error("Erreur dans EnableDisableA2F", err);
      // et on rétablit l'ancien état
      const old = authStorage.getOld2fa?.();
      if (typeof old !== "undefined") {
        checkbox.checked = old || false;
      }
    }
  });

  return wrapper;
}

export function createAvatarButton(onClick: () => void = () => {}) {
  return createCustomButton({
    text: t("avatar"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    padding: "p-[10px]",
    onClick,
  });
}

export function createLogoutButton(modal: HTMLElement | null, homedesktop: boolean) {
  const LogoutButtonOptions = {
    text: t("disco"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "",
    padding: "p-[10px]",
    onClick: () => {
      authStorage.clearAuth();
      navigateTo("/");
      if (modal !== null) {
        modal.style.transform = "translateY(-100%)";
        setTimeout(() => modal.remove(), 300);
      }
    },
  };

  if (!homedesktop) {
    LogoutButtonOptions.position =
      "absolute transform -translate-x-1/2 -translate-y-1/2 top-9/10 left-1/2";
  } else {
    LogoutButtonOptions.position = "sm:block hidden";
  }

  return createCustomButton({
    ...LogoutButtonOptions,
  });
}
