import { createSignInForm } from "./SignIn.ts";
import { createSignUpForm } from "./SignUp.ts";
import { navigateTo } from "@/router.ts";
import { t } from "@utils/i18n.ts";
import { createCustomButton } from "@/components/Buttons/CustomButton.ts"; // adapte le chemin si besoin

export function renderSignModal() {
  // Création du modal overlay
  const modal = document.createElement("div");
  modal.id = "sign-modal";
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
  });

  navigateTo("home");

  // Card principale
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-3xl shadow-lg max-w-md w-full p-8 relative overflow-hidden flex flex-col items-center";

  // Toggle boutons (Connexion / Inscription)
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "flex justify-center mb-6 space-x-6";

  // Création boutons toggle via custom button
  function createToggleButton(
    text: string,
    active: boolean,
    onClick: () => void
  ) {
    return createCustomButton({
      text,
      width: "112px", // 28*4px
      height: "40px",
      borderRadius: "rounded-[15px]",

      fontSizeClass: "text-lg",
      //fontStyle: "font-jaro",

      backgroundColor: active ? "bg-blue-600" : "bg-gray-300",
      textColor: active ? "text-white" : "text-gray-700",
      borderColor: active ? "border-blue-700" : "border-gray-300",
    });
  }

  let activeForm: "signIn" | "signUp" = "signIn";

  const btnSignIn = createToggleButton(t("signin"), true, () => {
    if (activeForm !== "signIn") {
      activeForm = "signIn";
      updateToggle();
    }
  });
  const btnSignUp = createToggleButton(t("signup"), false, () => {
    if (activeForm !== "signUp") {
      activeForm = "signUp";
      updateToggle();
    }
  });

  toggleContainer.appendChild(btnSignIn);
  toggleContainer.appendChild(btnSignUp);
  card.appendChild(toggleContainer);

  // Container des formulaires avec positionnement slide
  const formsContainer = document.createElement("div");
  formsContainer.className = "relative h-[400px] w-full overflow-hidden";

  const onAuthSuccess = () => {
    // Ferme le modal de connexion
    const signModal = document.getElementById("sign-modal");
    if (signModal) {
      document.body.removeChild(signModal);
    }

    // Ferme aussi le menu mobile s'il est ouvert
    const menuModal = document.getElementById("menu-modal");
    if (menuModal) {
      // Anime la fermeture
      menuModal.style.transform = "translateX(100%)";
      setTimeout(() => menuModal.remove(), 300);
    }

    navigateTo("home");
  };

  const formSignIn = createSignInForm(onAuthSuccess);
  const formSignUp = createSignUpForm(onAuthSuccess);

  Object.assign(formSignIn.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    transition: "transform 0.3s ease",
  });

  Object.assign(formSignUp.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    transition: "transform 0.3s ease",
  });

  formsContainer.appendChild(formSignIn);
  formsContainer.appendChild(formSignUp);
  card.appendChild(formsContainer);

  // Bouton de retour (custom)
  const backButton = createCustomButton({
    text: t("back"),
    height: "40px",
    borderRadius: "rounded-[15px]",
    borderWidth: "border-0",
    textColor: "text-gray-800",
    //fontStyle: "font-jaro",
    fontSizeClass: "text-lg",

    onClick: () => {
      document.body.removeChild(modal);
      navigateTo("home");
    },
  });

  card.appendChild(backButton);

  modal.appendChild(card);
  document.body.appendChild(modal);

  // Mise à jour visuelle des boutons et position des formulaires
  function updateToggle() {
    if (activeForm === "signIn") {
      btnSignIn.classList.add("bg-blue-600", "text-white", "border-blue-700");
      btnSignIn.classList.remove(
        "bg-gray-300",
        "text-gray-700",
        "border-gray-300"
      );

      btnSignUp.classList.add(
        "bg-gray-300",
        "text-gray-700",
        "border-gray-300"
      );
      btnSignUp.classList.remove(
        "bg-blue-600",
        "text-white",
        "border-blue-700"
      );

      formSignIn.style.transform = "translateX(0)";
      formSignUp.style.transform = "translateX(100%)";
    } else {
      btnSignUp.classList.add("bg-blue-600", "text-white", "border-blue-700");
      btnSignUp.classList.remove(
        "bg-gray-300",
        "text-gray-700",
        "border-gray-300"
      );

      btnSignIn.classList.add(
        "bg-gray-300",
        "text-gray-700",
        "border-gray-300"
      );
      btnSignIn.classList.remove(
        "bg-blue-600",
        "text-white",
        "border-blue-700"
      );

      formSignIn.style.transform = "translateX(-100%)";
      formSignUp.style.transform = "translateX(0)";
    }
  }

  btnSignIn.addEventListener("click", () => {
    if (activeForm !== "signIn") {
      activeForm = "signIn";
      updateToggle();
    }
  });

  btnSignUp.addEventListener("click", () => {
    if (activeForm !== "signUp") {
      activeForm = "signUp";
      updateToggle();
    }
  });

  // Click fond modal ferme
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
      navigateTo("home");
    }
  });

  updateToggle();
}
