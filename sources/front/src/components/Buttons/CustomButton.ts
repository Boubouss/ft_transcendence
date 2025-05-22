interface CustomButtonOptions {
  backgroundColor?: string;
  width?: string;
  height?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  position?: string;
  text?: string;
  imageUrl?: string;
  fontStyle?: string;
  fontSizeClass?: string;
  onClick?: () => void; // Nouvelle option : fonction à appeler lors du clic
}


export function createCustomButton(
  options: CustomButtonOptions
): HTMLButtonElement {
  const button = document.createElement("button");

  const classes = [
    options.position || "",
    options.backgroundColor || "bg-orange-500",
    options.textColor || "text-black",
    options.borderWidth || "border-2",
    options.borderColor || "border-black",
    options.borderRadius || "rounded-[20px]",
    options.fontStyle || "font-jaro font-semibold",
    options.fontSizeClass || "text-lg",
    "font-bold",
    "flex",
    "items-center",
    "justify-center",
  ]
    .filter(Boolean)
    .join(" ");

  button.className = classes;

  if (options.width) button.style.width = options.width;
  if (options.height) button.style.height = options.height;

  if (options.imageUrl) {
    const img = document.createElement("img");
    img.src = options.imageUrl;
    img.alt = options.text || "button image";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    button.appendChild(img);
  } else {
    button.textContent = options.text || "Cliquer";
  }

  // Remplace la redirection par une fonction callback
  if (typeof options.onClick === "function") {
    button.addEventListener("click", options.onClick);
  }

  if (options.fontStyle?.includes("font-jaro")) {
    button.style.fontFamily = '"Jaro", sans-serif';
  }

    function addHoverEffect(button: HTMLButtonElement) {
    button.addEventListener("mouseenter", () => {
      button.classList.add("shadow-lg", "brightness-110");
    });
    button.addEventListener("mouseleave", () => {
      button.classList.remove("shadow-lg", "brightness-110");
    });
  }

  addHoverEffect(button);

  return button;
}


