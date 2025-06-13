import { createCustomButton } from "@/components/Buttons/CustomButton";
import { t } from "@utils/i18n";
import * as authStorage from "@utils/authStorage";
import { navigateTo } from "@/router";

export function createCloseModalButton(onClick: () => void) {
  return createCustomButton({
    width: "50px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "38px",
    imageHeight: "38px",
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
    height: "50px",
    width: "140px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: isEnabled ? "bg-red-500" : "bg-green-500",
    padding: "p-[28px]",
    onClick,
  });
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


export function createLogoutButton(modal: any) {
  return createCustomButton({
    text: t("disco"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position:
      "absolute top-9/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:top-8/10 sm:left-8/10",
    padding: "p-[10px]",
    onClick: () => {
      authStorage.clearAuth();
      navigateTo("home");
      if (modal !== null) modal.remove();
    },
  });
}
