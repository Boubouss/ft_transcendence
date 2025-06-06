import { createCustomButton } from "@/components/Buttons/CustomButton";
import { t } from "@utils/i18n";
import * as authStorage from "@utils/authStorage";

export function createCloseModalButton(onClick: () => void) {
  return createCustomButton({
    width: "60px",
    height: "60px",
    borderRadius: "rounded-[20px]",
    position: "absolute top-5 right-5",
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
  const isEnabled = authStorage.getA2F();
  return createCustomButton({
    text: isEnabled ? t("offa2f") : t("ona2f"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: isEnabled ? "bg-red-500" : "bg-green-500",
    position: "absolute top-175 left-[10%] sm:top-98 sm:right-10",
    padding: "p-[10px]",
    onClick,
  });
}

export function createLogoutButton(onClick: () => void) {
  return createCustomButton({
    text: t("disco"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute bottom-[10%] right-[10%]",
    padding: "p-[10px]",
    onClick,
  });
}

export function createAvatarButton(onClick: () => void = () => {}) {
  return createCustomButton({
    text: t("avatar"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    position: "absolute top-177 right-10 sm:top-78",
    padding: "p-[10px]",
    visible: false,
    onClick,
  });
}
