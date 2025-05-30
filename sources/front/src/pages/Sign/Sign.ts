import { createSignInForm } from "./SignIn.ts";
import { createSignUpForm } from "./SignUp.ts";
import { navigateTo } from "../../router.ts";

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

  function createToggleButton(text: string, active: boolean) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.type = "button";
    btn.className = `
      font-semibold text-lg w-28 h-10 border-2 rounded transition-all duration-300
      ${
        active
          ? "bg-blue-600 text-white border-blue-700"
          : "bg-gray-300 text-gray-700 border-gray-300"
      }
    `;
    return btn;
  }

  let activeForm: "signIn" | "signUp" = "signIn";

  const btnSignIn = createToggleButton("Connexion", true);
  const btnSignUp = createToggleButton("Inscription", false);
  toggleContainer.appendChild(btnSignIn);
  toggleContainer.appendChild(btnSignUp);
  card.appendChild(toggleContainer);

  // Container des formulaires avec positionnement slide
  const formsContainer = document.createElement("div");
  formsContainer.className = "relative h-[400px] w-full overflow-hidden";

  const onAuthSuccess = () => {
    document.body.removeChild(modal);
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

  // Bouton de retour
  const backButton = document.createElement("button");
  backButton.textContent = "Retour";
  backButton.className =
    "mt-6 w-24 h-10 border border-gray-400 text-gray-800 font-semibold rounded";
  backButton.addEventListener("click", () => {
    document.body.removeChild(modal);
    navigateTo("home");
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

  // Juste après avoir créé le modal, avant de l'ajouter au DOM
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      // Click sur le fond (pas dans la card)
      document.body.removeChild(modal);
      navigateTo("home");
    }
  });

  updateToggle();
}
