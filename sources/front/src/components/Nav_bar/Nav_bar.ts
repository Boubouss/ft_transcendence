import { createCustomButton } from "../Buttons/CustomButton.ts";

export function renderNavBar() {
  const app = document.createElement("div");

  app.innerHTML = `
      <div id="button-container" class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6">
      </div>
    </div>
  `;

  const buttonContainer = app.querySelector("#button-container")!;

  const commonButtonOptions = {
    backgroundColor: "bg-[#D6A01A]",
    width: "274px",
    height: "93px",
    textColor: "text-black",
    borderColor: "border-black",
    borderWidth: "border-2",
    borderRadius: "rounded-[20px]",
    fontStyle: "font-jaro font-semibold", // police sans serif semi-bold
    fontSizeClass: "text-4xl",
    // position : ne pas mettre ici, géré par le container flex
  };

  function addHoverEffect(button: HTMLButtonElement) {
    button.addEventListener("mouseenter", () => {
      button.classList.add("shadow-lg", "brightness-110");
    });
    button.addEventListener("mouseleave", () => {
      button.classList.remove("shadow-lg", "brightness-110");
    });
  }

  const local_button = createCustomButton({
    ...commonButtonOptions,
    redirectUrl: "/local",
    text: "Local",
  });
  addHoverEffect(local_button);


  const multiplayer_button = createCustomButton({
    ...commonButtonOptions,
    redirectUrl: "/multiplayer",
    text: "Multiplayer",
  });
  addHoverEffect(multiplayer_button);

  multiplayer_button.style.filter = "brightness(0.6)";

  const quit_button = createCustomButton({
    ...commonButtonOptions,
    redirectUrl: "/quit",
    text: "Carriere",
  });
  addHoverEffect(quit_button);

  buttonContainer.appendChild(local_button);
  buttonContainer.appendChild(multiplayer_button);
  buttonContainer.appendChild(quit_button);

  document.body.appendChild(app);
}
