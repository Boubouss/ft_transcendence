import { createSignInForm } from "./SignIn.ts";
import { createSignUpForm } from "./SignUp.ts";
import { navigateTo } from "../../router.ts"; // adapte selon ta structure

export function renderSign() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;
  appRoot.innerHTML = "";

  // Container principal
  const container = document.createElement("div");
  container.className = "h-screen w-screen flex flex-col items-center justify-center bg-gray-100 px-4";

  // Card
  const card = document.createElement("div");
  card.className = "bg-white rounded-3xl shadow-lg max-w-md w-full p-8 relative overflow-hidden flex flex-col items-center";

  // Toggle buttons container
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "flex justify-center mb-6 space-x-6";

  // Création boutons toggle
  function createToggleButton(text: string, active: boolean) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.type = "button";
    btn.className = `
      font-semibold text-lg w-28 h-10 border-2 rounded
      ${active ? "bg-blue-600 text-white border-blue-700" : "bg-gray-300 text-gray-700 border-gray-300"}
    `;
    return btn;
  }

  let activeForm: "signIn" | "signUp" = "signIn";

  const btnSignIn = createToggleButton("Connexion", true);
  const btnSignUp = createToggleButton("Inscription", false);

  toggleContainer.appendChild(btnSignIn);
  toggleContainer.appendChild(btnSignUp);
  card.appendChild(toggleContainer);

  // Container des formulaires
  const formsContainer = document.createElement("div");
  formsContainer.className = "relative h-[400px] w-full overflow-hidden";

  // Callback appelé quand inscription ou connexion réussit
  function onAuthSuccess() {
    navigateTo("home");
  }

  // Création des formulaires
  const formSignIn = createSignInForm(onAuthSuccess);
  const formSignUp = createSignUpForm(onAuthSuccess);

  formsContainer.appendChild(formSignIn);
  formsContainer.appendChild(formSignUp);
  card.appendChild(formsContainer);

  // Bouton retour
  const backButton = document.createElement("button");
  backButton.textContent = "Retour";
  backButton.className = "mt-6 w-24 h-10 border border-gray-400 text-gray-800 font-semibold rounded";
  backButton.addEventListener("click", () => {
    navigateTo("home");
  });
  card.appendChild(backButton);

  container.appendChild(card);
  appRoot.appendChild(container);

  // Mise à jour visuelle du toggle et animation formulaire
  function updateToggle() {
    if (activeForm === "signIn") {
      btnSignIn.classList.add("bg-blue-600", "text-white", "border-blue-700");
      btnSignIn.classList.remove("bg-gray-300", "text-gray-700", "border-gray-300");

      btnSignUp.classList.add("bg-gray-300", "text-gray-700", "border-gray-300");
      btnSignUp.classList.remove("bg-blue-600", "text-white", "border-blue-700");

      formSignIn.style.transform = "translateX(0)";
      formSignUp.style.transform = "translateX(100%)";
    } else {
      btnSignUp.classList.add("bg-blue-600", "text-white", "border-blue-700");
      btnSignUp.classList.remove("bg-gray-300", "text-gray-700", "border-gray-300");

      btnSignIn.classList.add("bg-gray-300", "text-gray-700", "border-gray-300");
      btnSignIn.classList.remove("bg-blue-600", "text-white", "border-blue-700");

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

  updateToggle(); // initial
}
