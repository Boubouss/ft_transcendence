import { createSignInForm } from "./LoginIn.ts";
import { createSignUpForm } from "./SignIn.ts";
import { navigateTo } from "@/router.ts";
import { t } from "@utils/i18n.ts";
import { createCustomButton } from "@/components/Buttons/CustomButton.ts"; // adapte le chemin si besoin

export function renderSignModal() {
  // Création du modal overlay
  const modal = document.createElement("div");
  modal.id = "sign-modal";

  modal.className = `
  fixed
  top-0
  left-0
  w-full
  h-full
  flex
  items-center
  justify-center`;

  navigateTo("home");

  // Card principale
  const card = document.createElement("div");
  card.className =
    "bg-orange-400 rounded-3xl shadow-lg max-w-md w-full h-[60%] m-5 border-2 p-8 relative overflow-hidden flex flex-col items-center";

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
      minWidth: "112px",
      height: "40px",
      borderRadius: "rounded-[20px]",
      padding: "p-2",
      fontSizeClass: "text-lg",


    });
  }

  let activeForm: "signIn" | "signin" = "signIn";

  const btnSignIn = createToggleButton(t("loginin"), true, () => {
    if (activeForm !== "signIn") {
      activeForm = "signIn";
      updateToggle();
    }
  });
  const btnSignUp = createToggleButton(t("signin"), false, () => {
    if (activeForm !== "signin") {
      activeForm = "signin";
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
      menuModal.style.transform = "translateY(-100%)";
      setTimeout(() => menuModal.remove(), 300);
    }

    navigateTo("home");
  };

  const formSignIn = createSignInForm(onAuthSuccess);

  formSignIn.className = `
  absolute
  top-0
  left-0
  w-full
  h-100
  transition
  duration-300
  ease-in-out
  flex flex-col items-center
  `;

  const formSignUp = createSignUpForm(onAuthSuccess);

  formSignUp.className = `
  absolute
  top-0
  left-0
  w-full
  h-100
  transition
  duration-300
  ease-in-out
  flex flex-col items-center
  `;

  formsContainer.appendChild(formSignIn);
  formsContainer.appendChild(formSignUp);
  card.appendChild(formsContainer);

  // Bouton de retour (custom)
  const backButton = createCustomButton({
    text: t("back"),
    height: "50px",
    borderRadius: "rounded-[20px]",
    borderWidth: "border-2",
    backgroundColor: "bg-[#FFFFFF99]",
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
      btnSignIn.classList.add("text-white", "border-black");
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
      btnSignUp.classList.add("text-white", "border-blackz-700");
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
    if (activeForm !== "signin") {
      activeForm = "signin";
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
